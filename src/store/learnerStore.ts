// Learner Store - Central State Management
// Single source of truth for learner profile

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type { LearnerProfile } from '../types/learner';
import { DEFAULT_LEARNER_PROFILE } from '../types/learner';
import { saveLearnerProfile, loadLearnerProfile } from '../services/persistence';

interface LearnerState {
    profile: LearnerProfile;
    isLoading: boolean;
    isInitialized: boolean;

    // Actions
    initialize: () => Promise<void>;
    updateProfile: (updates: Partial<LearnerProfile>) => Promise<void>;
    resetProfile: () => Promise<void>;
    incrementStreak: () => Promise<void>;
    updateMastery: (delta: number) => Promise<void>;
    updateFatigue: (delta: number) => Promise<void>;
    recordSkippedDay: () => Promise<void>;
    markSessionComplete: (date: string) => Promise<void>;
}

export const useLearnerStore = create<LearnerState>()(
    immer((set, get) => ({
        profile: DEFAULT_LEARNER_PROFILE,
        isLoading: true,
        isInitialized: false,

        initialize: async () => {
            set((state) => {
                state.isLoading = true;
            });

            try {
                const savedProfile = await loadLearnerProfile();

                set((state) => {
                    if (savedProfile) {
                        state.profile = savedProfile;
                    }
                    state.isLoading = false;
                    state.isInitialized = true;
                });
            } catch (error) {
                console.error('[LearnerStore] Failed to load profile:', error);
                set((state) => {
                    state.isLoading = false;
                    state.isInitialized = true;
                });
            }
        },

        updateProfile: async (updates) => {
            set((state) => {
                Object.assign(state.profile, updates);
            });

            const currentProfile = get().profile;
            await saveLearnerProfile(currentProfile);
        },

        resetProfile: async () => {
            set((state) => {
                state.profile = { ...DEFAULT_LEARNER_PROFILE };
            });

            await saveLearnerProfile(DEFAULT_LEARNER_PROFILE);
        },

        incrementStreak: async () => {
            set((state) => {
                state.profile.streakCount += 1;
            });

            await saveLearnerProfile(get().profile);
        },

        updateMastery: async (delta) => {
            set((state) => {
                state.profile.masteryScore = Math.max(
                    0,
                    Math.min(100, state.profile.masteryScore + delta)
                );
            });

            await saveLearnerProfile(get().profile);
        },

        updateFatigue: async (delta) => {
            set((state) => {
                state.profile.fatigueScore = Math.max(
                    0,
                    Math.min(100, state.profile.fatigueScore + delta)
                );
            });

            await saveLearnerProfile(get().profile);
        },

        recordSkippedDay: async () => {
            set((state) => {
                state.profile.skippedDaysCount += 1;
                // Reduce streak by half on skipped day (not harsh penalty)
                state.profile.streakCount = Math.floor(state.profile.streakCount / 2);
            });

            await saveLearnerProfile(get().profile);
        },

        markSessionComplete: async (date) => {
            set((state) => {
                state.profile.lastActiveDate = date;
                state.profile.skippedDaysCount = 0; // Reset skip counter
            });

            await saveLearnerProfile(get().profile);
        },
    }))
);

// Selector hooks for common access patterns
export const useProfile = () => useLearnerStore((state) => state.profile);
export const useIsOnboarded = () => useLearnerStore((state) => state.profile.onboardingComplete);
export const useIsLoading = () => useLearnerStore((state) => state.isLoading);
export const useStreakCount = () => useLearnerStore((state) => state.profile.streakCount);
export const useMasteryScore = () => useLearnerStore((state) => state.profile.masteryScore);
