// Onboarding Agent
// Collects learner profile and triggers curriculum generation

import type { LearnerProfile, Persona, LearningFormat, SkillLevel, TimeBudget, GoalHorizon } from '../types/learner';
import { useLearnerStore } from '../store/learnerStore';
import { emit } from '../services/eventBus';

export interface OnboardingInput {
    persona: Persona;
    motivation: string;
    dailyTimeBudget: TimeBudget;
    preferredFormat: LearningFormat;
    skillBaseline: SkillLevel;
    goalHorizon: GoalHorizon;
    futureSelfIdentity: string;
}

export interface OnboardingOutput {
    success: boolean;
    profile: Partial<LearnerProfile>;
}

export const onboardingAgent = {
    name: 'OnboardingAgent',

    async execute(input: OnboardingInput): Promise<OnboardingOutput> {
        console.log('[OnboardingAgent] Starting onboarding...');

        // Validate input
        if (!input.motivation?.trim()) {
            throw new Error('Motivation is required');
        }

        if (!input.futureSelfIdentity?.trim()) {
            throw new Error('Future self identity is required');
        }

        // Build profile updates
        const profileUpdates: Partial<LearnerProfile> = {
            persona: input.persona,
            motivation: input.motivation.trim(),
            dailyTimeBudget: input.dailyTimeBudget,
            preferredFormat: input.preferredFormat,
            skillBaseline: input.skillBaseline,
            goalHorizon: input.goalHorizon,
            futureSelfIdentity: input.futureSelfIdentity.trim(),
            onboardingComplete: true,
            masteryScore: input.skillBaseline * 10, // Initialize based on baseline
            fatigueScore: 0,
            streakCount: 0,
            skippedDaysCount: 0,
            lastActiveDate: null,
            currentModule: null,
            currentTopic: null,
        };

        // Persist to store
        await useLearnerStore.getState().updateProfile(profileUpdates);

        console.log('[OnboardingAgent] Profile saved, emitting event...');

        // Emit completion event
        await emit({
            type: 'onboarding_complete',
            payload: { profile: profileUpdates }
        });

        return {
            success: true,
            profile: profileUpdates
        };
    },

    // Check if onboarding is needed
    isOnboardingRequired(): boolean {
        const { profile, isInitialized } = useLearnerStore.getState();
        return isInitialized && !profile.onboardingComplete;
    }
};
