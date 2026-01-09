// Curriculum Types - Structured Learning Roadmap

export interface DailySession {
    id: string;
    title: string;
    estimatedMinutes: number;
    completed: boolean;
    completedDate: string | null;
}

export interface Topic {
    id: string;
    title: string;
    description: string;
    sessions: DailySession[];
    masteryRequired: number; // 0-100
    currentMastery: number;
}

export interface Module {
    id: string;
    title: string;
    description: string;
    topics: Topic[];
    order: number;
    unlocked: boolean;
}

export interface Curriculum {
    id: string;
    title: string;
    description: string;
    modules: Module[];
    createdAt: string;
    lastUpdated: string;
}

export interface CurriculumProgress {
    totalModules: number;
    completedModules: number;
    totalTopics: number;
    completedTopics: number;
    totalSessions: number;
    completedSessions: number;
    overallProgress: number; // 0-100
}
