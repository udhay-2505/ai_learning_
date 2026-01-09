// Learner Profile - Single Source of Truth
// Matches the execution trace specification

export type Persona = 'student' | 'founder' | 'early-career' | 'developer';
export type LearningFormat = 'reading' | 'video' | 'hands-on' | 'mixed';
export type SkillLevel = 0 | 1 | 2 | 3 | 4 | 5;
export type TimeBudget = 10 | 20 | 30;
export type GoalHorizon = 3 | 6;

export interface LearnerProfile {
  // Onboarding data (collected once)
  persona: Persona;
  motivation: string;
  dailyTimeBudget: TimeBudget;
  preferredFormat: LearningFormat;
  skillBaseline: SkillLevel;
  goalHorizon: GoalHorizon;
  futureSelfIdentity: string;

  // Runtime state (updated by agents)
  currentModule: string | null;
  currentTopic: string | null;
  masteryScore: number;
  fatigueScore: number;
  streakCount: number;
  lastActiveDate: string | null;
  skippedDaysCount: number;
  
  // Onboarding completion flag
  onboardingComplete: boolean;
}

export const DEFAULT_LEARNER_PROFILE: LearnerProfile = {
  persona: 'student',
  motivation: '',
  dailyTimeBudget: 20,
  preferredFormat: 'mixed',
  skillBaseline: 0,
  goalHorizon: 3,
  futureSelfIdentity: '',
  
  currentModule: null,
  currentTopic: null,
  masteryScore: 0,
  fatigueScore: 0,
  streakCount: 0,
  lastActiveDate: null,
  skippedDaysCount: 0,
  
  onboardingComplete: false,
};
