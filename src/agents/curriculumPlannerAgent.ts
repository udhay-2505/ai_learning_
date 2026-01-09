// Curriculum Planner Agent (RAG-backed)
// Generates personalized learning roadmap based on learner profile

import type { LearnerProfile } from '../types/learner';
import type { Curriculum, Module, Topic, DailySession } from '../types/curriculum';
import { useLearnerStore } from '../store/learnerStore';
import { useCurriculumStore } from '../store/curriculumStore';
import { emit } from '../services/eventBus';
import { queryKnowledgeBase, curriculumKB } from '../rag';

interface CurriculumPlannerInput {
    profile: LearnerProfile;
}

interface CurriculumPlannerOutput {
    curriculum: Curriculum;
}

// Map skill levels to starting modules
const SKILL_TO_MODULE_MAP: Record<number, string[]> = {
    0: ['fundamentals'],
    1: ['fundamentals', 'machine-learning'],
    2: ['machine-learning', 'deep-learning'],
    3: ['deep-learning', 'llm-transformers'],
    4: ['llm-transformers', 'applied-ai'],
    5: ['applied-ai'],
};

// Sessions per topic based on time budget
const TIME_TO_SESSIONS: Record<number, number> = {
    10: 3, // Fewer sessions, focus on essentials
    20: 4, // Balanced
    30: 5, // More depth
};

function generateSessionsForTopic(
    topicId: string,
    topicTitle: string,
    count: number,
    timeBudget: number
): DailySession[] {
    const sessions: DailySession[] = [];

    for (let i = 0; i < count; i++) {
        sessions.push({
            id: `${topicId}-session-${i + 1}`,
            title: i === 0
                ? `Introduction to ${topicTitle}`
                : i === count - 1
                    ? `${topicTitle} Practice & Review`
                    : `${topicTitle} Deep Dive ${i}`,
            estimatedMinutes: timeBudget,
            completed: false,
            completedDate: null,
        });
    }

    return sessions;
}

function generateTopicsForModule(
    moduleId: string,
    moduleTitle: string,
    profile: LearnerProfile
): Topic[] {
    // Query RAG for module-specific content
    const ragResult = queryKnowledgeBase(curriculumKB, {
        query: `${moduleId} ${profile.persona} ${profile.motivation}`,
        filters: { module: moduleId },
        topK: 4,
    });

    const sessionsPerTopic = TIME_TO_SESSIONS[profile.dailyTimeBudget] ?? 4;

    // Generate topics from RAG results
    const topics: Topic[] = ragResult.chunks.map((chunk, index) => {
        const topicId = `${moduleId}-topic-${index + 1}`;
        const topicTitle = extractTopicTitle(chunk.content, moduleTitle, index);

        return {
            id: topicId,
            title: topicTitle,
            description: chunk.content.slice(0, 150) + '...',
            sessions: generateSessionsForTopic(
                topicId,
                topicTitle,
                sessionsPerTopic,
                profile.dailyTimeBudget
            ),
            masteryRequired: 70,
            currentMastery: 0,
        };
    });

    // Ensure at least 2 topics per module
    if (topics.length < 2) {
        topics.push({
            id: `${moduleId}-topic-core`,
            title: `Core Concepts of ${moduleTitle}`,
            description: `Fundamental understanding of ${moduleTitle.toLowerCase()} principles and applications.`,
            sessions: generateSessionsForTopic(
                `${moduleId}-topic-core`,
                `Core ${moduleTitle}`,
                sessionsPerTopic,
                profile.dailyTimeBudget
            ),
            masteryRequired: 70,
            currentMastery: 0,
        });
    }

    return topics;
}

function extractTopicTitle(content: string, moduleTitle: string, index: number): string {
    // Try to extract a meaningful title from content
    const firstSentence = content.split(/[.!?]/)[0];
    const words = firstSentence.split(' ').slice(0, 4).join(' ');

    if (words.length > 5) {
        return words;
    }

    return `${moduleTitle} Concept ${index + 1}`;
}

const MODULE_TITLES: Record<string, string> = {
    'fundamentals': 'AI Fundamentals',
    'machine-learning': 'Machine Learning',
    'deep-learning': 'Deep Learning',
    'llm-transformers': 'LLMs & Transformers',
    'applied-ai': 'Applied AI',
};

const MODULE_DESCRIPTIONS: Record<string, string> = {
    'fundamentals': 'Core concepts of AI and machine learning',
    'machine-learning': 'Building and training traditional ML models',
    'deep-learning': 'Neural networks and deep architectures',
    'llm-transformers': 'Large language models and attention mechanisms',
    'applied-ai': 'Real-world AI applications and deployment',
};

export const curriculumPlannerAgent = {
    name: 'CurriculumPlannerAgent',

    async execute(input: CurriculumPlannerInput): Promise<CurriculumPlannerOutput> {
        console.log('[CurriculumPlannerAgent] Generating curriculum...');

        const { profile } = input;

        // Determine which modules to include based on skill level
        const skillModules = SKILL_TO_MODULE_MAP[profile.skillBaseline] ?? ['fundamentals'];

        // Expand based on goal horizon
        let allModules = [...skillModules];
        if (profile.goalHorizon === 6) {
            // Add more advanced modules for longer horizon
            const moduleOrder = ['fundamentals', 'machine-learning', 'deep-learning', 'llm-transformers', 'applied-ai'];
            const lastModule = skillModules[skillModules.length - 1];
            const lastIndex = moduleOrder.indexOf(lastModule);

            for (let i = lastIndex + 1; i < moduleOrder.length && allModules.length < 4; i++) {
                allModules.push(moduleOrder[i]);
            }
        }

        // Remove duplicates and maintain order
        allModules = [...new Set(allModules)];

        // Generate modules with topics
        const modules: Module[] = allModules.map((moduleId, index) => ({
            id: moduleId,
            title: MODULE_TITLES[moduleId] ?? moduleId,
            description: MODULE_DESCRIPTIONS[moduleId] ?? '',
            topics: generateTopicsForModule(moduleId, MODULE_TITLES[moduleId], profile),
            order: index,
            unlocked: index === 0, // Only first module unlocked initially
        }));

        const curriculum: Curriculum = {
            id: `curriculum-${Date.now()}`,
            title: `AI Learning Path for ${profile.persona}`,
            description: `A personalized ${profile.goalHorizon}-month learning journey focused on ${profile.motivation}`,
            modules,
            createdAt: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
        };

        // Save to store
        await useCurriculumStore.getState().setCurriculum(curriculum);

        // Update learner profile with current position
        await useLearnerStore.getState().updateProfile({
            currentModule: modules[0].id,
            currentTopic: modules[0].topics[0]?.id ?? null,
        });

        console.log('[CurriculumPlannerAgent] Curriculum generated, emitting event...');

        // Emit completion event
        await emit({
            type: 'curriculum_generated',
            payload: { curriculum }
        });

        return { curriculum };
    }
};
