// Curriculum Store - Learning Roadmap State

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { Curriculum, CurriculumProgress, Module, Topic } from '../types/curriculum';
import { saveCurriculum, loadCurriculum } from '../services/persistence';

interface CurriculumState {
    curriculum: Curriculum | null;
    isLoading: boolean;

    // Actions
    initialize: () => Promise<void>;
    setCurriculum: (curriculum: Curriculum) => Promise<void>;
    markSessionComplete: (topicId: string, sessionId: string) => Promise<void>;
    advanceToNextTopic: () => Promise<void>;
    getProgress: () => CurriculumProgress;
    getCurrentModule: () => Module | null;
    getCurrentTopic: () => Topic | null;
    getNextSession: () => { moduleId: string; topicId: string; sessionId: string } | null;
}

export const useCurriculumStore = create<CurriculumState>()(
    immer((set, get) => ({
        curriculum: null,
        isLoading: true,

        initialize: async () => {
            set((state) => {
                state.isLoading = true;
            });

            try {
                const savedCurriculum = await loadCurriculum();
                set((state) => {
                    state.curriculum = savedCurriculum;
                    state.isLoading = false;
                });
            } catch (error) {
                console.error('[CurriculumStore] Failed to load curriculum:', error);
                set((state) => {
                    state.isLoading = false;
                });
            }
        },

        setCurriculum: async (curriculum) => {
            set((state) => {
                state.curriculum = curriculum;
            });
            await saveCurriculum(curriculum);
        },

        markSessionComplete: async (topicId, sessionId) => {
            set((state) => {
                if (!state.curriculum) return;

                for (const module of state.curriculum.modules) {
                    for (const topic of module.topics) {
                        if (topic.id === topicId) {
                            const session = topic.sessions.find((s) => s.id === sessionId);
                            if (session) {
                                session.completed = true;
                                session.completedDate = new Date().toISOString();
                            }
                        }
                    }
                }
                state.curriculum.lastUpdated = new Date().toISOString();
            });

            const curriculum = get().curriculum;
            if (curriculum) {
                await saveCurriculum(curriculum);
            }
        },

        advanceToNextTopic: async () => {
            // Logic to move to next topic when current is complete
            // This will be called by the adaptation agent
            const curriculum = get().curriculum;
            if (curriculum) {
                await saveCurriculum(curriculum);
            }
        },

        getProgress: () => {
            const curriculum = get().curriculum;
            if (!curriculum) {
                return {
                    totalModules: 0,
                    completedModules: 0,
                    totalTopics: 0,
                    completedTopics: 0,
                    totalSessions: 0,
                    completedSessions: 0,
                    overallProgress: 0,
                };
            }

            let totalTopics = 0;
            let completedTopics = 0;
            let totalSessions = 0;
            let completedSessions = 0;

            for (const module of curriculum.modules) {
                for (const topic of module.topics) {
                    totalTopics++;
                    const allComplete = topic.sessions.every((s) => s.completed);
                    if (allComplete && topic.sessions.length > 0) {
                        completedTopics++;
                    }
                    for (const session of topic.sessions) {
                        totalSessions++;
                        if (session.completed) {
                            completedSessions++;
                        }
                    }
                }
            }

            const completedModules = curriculum.modules.filter((m) =>
                m.topics.every((t) => t.sessions.every((s) => s.completed))
            ).length;

            return {
                totalModules: curriculum.modules.length,
                completedModules,
                totalTopics,
                completedTopics,
                totalSessions,
                completedSessions,
                overallProgress: totalSessions > 0
                    ? Math.round((completedSessions / totalSessions) * 100)
                    : 0,
            };
        },

        getCurrentModule: () => {
            const curriculum = get().curriculum;
            if (!curriculum) return null;

            // Find first unlocked module with incomplete topics
            return curriculum.modules.find((m) =>
                m.unlocked && m.topics.some((t) => t.sessions.some((s) => !s.completed))
            ) ?? null;
        },

        getCurrentTopic: () => {
            const currentModule = get().getCurrentModule();
            if (!currentModule) return null;

            // Find first topic with incomplete sessions
            return currentModule.topics.find((t) =>
                t.sessions.some((s) => !s.completed)
            ) ?? null;
        },

        getNextSession: () => {
            const curriculum = get().curriculum;
            if (!curriculum) return null;

            for (const module of curriculum.modules) {
                if (!module.unlocked) continue;

                for (const topic of module.topics) {
                    for (const session of topic.sessions) {
                        if (!session.completed) {
                            return {
                                moduleId: module.id,
                                topicId: topic.id,
                                sessionId: session.id,
                            };
                        }
                    }
                }
            }

            return null;
        },
    }))
);

// Selector hooks - use shallow comparison for objects to prevent infinite loops
export const useCurriculum = () => useCurriculumStore((state) => state.curriculum);

// Use a stable selector that doesn't create new objects on each call
export const useCurriculumProgress = () => {
    const curriculum = useCurriculumStore((state) => state.curriculum);

    if (!curriculum) {
        return {
            totalModules: 0,
            completedModules: 0,
            totalTopics: 0,
            completedTopics: 0,
            totalSessions: 0,
            completedSessions: 0,
            overallProgress: 0,
        };
    }

    let totalTopics = 0;
    let completedTopics = 0;
    let totalSessions = 0;
    let completedSessions = 0;

    for (const module of curriculum.modules) {
        for (const topic of module.topics) {
            totalTopics++;
            const allComplete = topic.sessions.every((s) => s.completed);
            if (allComplete && topic.sessions.length > 0) {
                completedTopics++;
            }
            for (const session of topic.sessions) {
                totalSessions++;
                if (session.completed) {
                    completedSessions++;
                }
            }
        }
    }

    const completedModules = curriculum.modules.filter((m) =>
        m.topics.every((t) => t.sessions.every((s) => s.completed))
    ).length;

    return {
        totalModules: curriculum.modules.length,
        completedModules,
        totalTopics,
        completedTopics,
        totalSessions,
        completedSessions,
        overallProgress: totalSessions > 0
            ? Math.round((completedSessions / totalSessions) * 100)
            : 0,
    };
};

export const useCurrentModule = () => {
    const curriculum = useCurriculumStore((state) => state.curriculum);
    if (!curriculum) return null;

    // Find first unlocked module with incomplete topics
    return curriculum.modules.find((m) =>
        m.unlocked && m.topics.some((t) => t.sessions.some((s) => !s.completed))
    ) ?? null;
};

export const useCurrentTopic = () => {
    const currentModule = useCurrentModule();
    if (!currentModule) return null;

    // Find first topic with incomplete sessions
    return currentModule.topics.find((t) =>
        t.sessions.some((s) => !s.completed)
    ) ?? null;
};
