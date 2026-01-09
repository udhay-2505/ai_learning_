// Session Types - Daily Learning Session State

export type EnergyLevel = 1 | 2 | 3 | 4 | 5;
export type DifficultyRating = 1 | 2 | 3 | 4 | 5;
export type SessionPhase = 'check-in' | 'lesson' | 'task' | 'reflection' | 'complete';

export interface CheckInData {
    energyLevel: EnergyLevel;
    availableTimeOverride: number | null;
    mentalLoad: 'low' | 'medium' | 'high';
    timestamp: string;
}

export interface MicroLesson {
    content: string; // ≤120 words
    source: string;
    topicId: string;
    generatedAt: string;
}

export interface ApplicationTask {
    instruction: string;
    type: 'explain' | 'implement' | 'analyze';
    difficulty: DifficultyRating;
    topicId: string;
}

export interface ReflectionData {
    difficultyRating: DifficultyRating;
    reflectionText: string;
    timestamp: string;
}

export interface SessionState {
    phase: SessionPhase;
    checkIn: CheckInData | null;
    lesson: MicroLesson | null;
    task: ApplicationTask | null;
    reflection: ReflectionData | null;
    startedAt: string | null;
    completedAt: string | null;
}

export const DEFAULT_SESSION_STATE: SessionState = {
    phase: 'check-in',
    checkIn: null,
    lesson: null,
    task: null,
    reflection: null,
    startedAt: null,
    completedAt: null,
};
