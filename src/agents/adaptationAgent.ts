// Adaptation Agent
// Updates learner state based on session completion signals

import type { ReflectionData, DifficultyRating } from '../types/session';
import { useLearnerStore } from '../store/learnerStore';
import { useCurriculumStore } from '../store/curriculumStore';
import { emit } from '../services/eventBus';
import { getDateDiffInDays } from '../utils/dates';

interface AdaptationInput {
    reflection: ReflectionData;
    topicId: string;
    completionTimeMinutes: number;
}

interface AdaptationOutput {
    masteryDelta: number;
    fatigueDelta: number;
    streakUpdated: boolean;
    nextSessionAdjustments: {
        difficultyChange: number;
        insertReview: boolean;
        reducedLength: boolean;
    };
}

// Mastery points based on difficulty rating
const MASTERY_POINTS: Record<DifficultyRating, number> = {
    1: 8,  // Too easy - still progress
    2: 10, // Easy - good progress
    3: 12, // Just right - optimal progress
    4: 8,  // Hard - reduced progress
    5: 5,  // Too hard - minimal progress
};

// Fatigue impact based on difficulty
const FATIGUE_IMPACT: Record<DifficultyRating, number> = {
    1: 0,  // No fatigue from easy work
    2: 5,
    3: 10,
    4: 15,
    5: 20, // High fatigue from struggle
};

export const adaptationAgent = {
    name: 'AdaptationAgent',

    async execute(input: AdaptationInput): Promise<AdaptationOutput> {
        console.log('[AdaptationAgent] Processing session completion...');

        const { reflection, topicId, completionTimeMinutes } = input;
        const learnerStore = useLearnerStore.getState();
        const curriculumStore = useCurriculumStore.getState();
        const profile = learnerStore.profile;

        // Check for skipped days
        const today = new Date().toISOString().split('T')[0];
        const lastActive = profile.lastActiveDate;
        const skippedDays = lastActive ? getDateDiffInDays(lastActive, today) - 1 : 0;

        // Handle skipped days
        if (skippedDays > 0) {
            await learnerStore.recordSkippedDay();
        }

        // Calculate mastery delta
        let masteryDelta = MASTERY_POINTS[reflection.difficultyRating];

        // Bonus for reflection text length (engagement)
        if (reflection.reflectionText.length > 50) {
            masteryDelta += 2;
        }

        // Penalty for rushing (completed in less than half expected time)
        const expectedTime = profile.dailyTimeBudget;
        if (completionTimeMinutes < expectedTime * 0.5) {
            masteryDelta = Math.floor(masteryDelta * 0.7);
        }

        // Calculate fatigue delta
        let fatigueDelta = FATIGUE_IMPACT[reflection.difficultyRating];

        // Recover fatigue on easier sessions
        if (reflection.difficultyRating <= 2) {
            fatigueDelta = -10; // Fatigue recovery
        }

        // Determine next session adjustments
        const nextSessionAdjustments = {
            difficultyChange: 0,
            insertReview: false,
            reducedLength: false,
        };

        // Execution trace logic:
        // IF skipped_days > 0 → reduce next session length
        if (skippedDays > 0) {
            nextSessionAdjustments.reducedLength = true;
        }

        // IF difficulty <= 2 → increase difficulty
        if (reflection.difficultyRating <= 2) {
            nextSessionAdjustments.difficultyChange = 1;
        }

        // IF difficulty >= 4 → insert review
        if (reflection.difficultyRating >= 4) {
            nextSessionAdjustments.insertReview = true;
        }

        // IF fatigue_score high → shorten next session
        if (profile.fatigueScore + fatigueDelta > 60) {
            nextSessionAdjustments.reducedLength = true;
        }

        // Update mastery and fatigue
        await learnerStore.updateMastery(masteryDelta);
        await learnerStore.updateFatigue(fatigueDelta);

        // Update streak
        await learnerStore.incrementStreak();
        await learnerStore.markSessionComplete(today);

        // Mark session as complete in curriculum
        const nextSession = curriculumStore.getNextSession();
        if (nextSession && nextSession.topicId === topicId) {
            await curriculumStore.markSessionComplete(topicId, nextSession.sessionId);
        }

        console.log('[AdaptationAgent] Adaptation complete, emitting event...');

        // Emit completion event
        await emit({
            type: 'adaptation_complete',
            payload: {
                masteryDelta,
                fatigueDelta,
                streakUpdated: true,
            }
        });

        return {
            masteryDelta,
            fatigueDelta,
            streakUpdated: true,
            nextSessionAdjustments,
        };
    },

    // Check if learner should have a review session
    shouldInsertReview(profile: { masteryScore: number; fatigueScore: number }): boolean {
        return profile.fatigueScore > 50 || profile.masteryScore < 30;
    }
};
