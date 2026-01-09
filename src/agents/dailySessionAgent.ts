// Daily Session Agent (RAG-backed)
// Generates micro-lessons and application tasks for daily sessions

import type { LearnerProfile } from '../types/learner';
import type { CheckInData, MicroLesson, ApplicationTask, DifficultyRating } from '../types/session';
import { useLearnerStore } from '../store/learnerStore';
import { useCurriculumStore } from '../store/curriculumStore';
import { useSessionStore } from '../store/sessionStore';
import { emit } from '../services/eventBus';
import { queryKnowledgeBase, microLessonKB, compressChunks, formatSources } from '../rag';

interface DailySessionInput {
    checkIn: CheckInData;
}

interface DailySessionOutput {
    lesson: MicroLesson;
    task: ApplicationTask;
}

// Task templates by type
const TASK_TEMPLATES = {
    explain: [
        'In your own words, explain the main concept from today\'s lesson in 2-3 sentences.',
        'Write a brief explanation that you could share with a colleague who hasn\'t learned this yet.',
        'Summarize the key insight from this lesson as if you were explaining it to yourself six months ago.',
    ],
    implement: [
        'Write a simple code snippet (5-10 lines) that demonstrates this concept.',
        'Create a basic function that implements the core idea from today\'s lesson.',
        'Write pseudocode showing how you would apply this concept to a real problem.',
    ],
    analyze: [
        'Identify one real-world application where this concept is used and explain why.',
        'Think of a scenario where this approach might fail. What are its limitations?',
        'Compare this concept to something you already know. What are the similarities and differences?',
    ],
};

// Select task type based on learner preferences
function selectTaskType(format: string, masteryScore: number): 'explain' | 'implement' | 'analyze' {
    if (format === 'hands-on' || format === 'developer') {
        return 'implement';
    }

    if (masteryScore < 30) {
        return 'explain'; // Build foundation first
    }

    if (masteryScore > 70) {
        return 'analyze'; // Higher-order thinking
    }

    // Random selection for mixed
    const types: Array<'explain' | 'implement' | 'analyze'> = ['explain', 'implement', 'analyze'];
    return types[Math.floor(Math.random() * types.length)];
}

// Adjust difficulty based on check-in and history
function calculateDifficulty(
    checkIn: CheckInData,
    masteryScore: number,
    fatigueScore: number
): DifficultyRating {
    let baseDifficulty = Math.ceil(masteryScore / 20) as DifficultyRating; // 1-5 based on mastery

    // Adjust for energy level
    if (checkIn.energyLevel <= 2) {
        baseDifficulty = Math.max(1, baseDifficulty - 1) as DifficultyRating;
    } else if (checkIn.energyLevel >= 4) {
        baseDifficulty = Math.min(5, baseDifficulty + 1) as DifficultyRating;
    }

    // Adjust for mental load
    if (checkIn.mentalLoad === 'high') {
        baseDifficulty = Math.max(1, baseDifficulty - 1) as DifficultyRating;
    }

    // Adjust for fatigue
    if (fatigueScore > 50) {
        baseDifficulty = Math.max(1, baseDifficulty - 1) as DifficultyRating;
    }

    return Math.max(1, Math.min(5, baseDifficulty)) as DifficultyRating;
}

export const dailySessionAgent = {
    name: 'DailySessionAgent',

    async execute(input: DailySessionInput): Promise<DailySessionOutput> {
        console.log('[DailySessionAgent] Generating session content...');

        const profile = useLearnerStore.getState().profile;
        const currentTopic = useCurriculumStore.getState().getCurrentTopic();
        const { checkIn } = input;

        if (!currentTopic) {
            throw new Error('No current topic available');
        }

        // Query RAG for lesson content
        const lessonQuery = `${currentTopic.title} ${profile.preferredFormat} beginner-friendly`;
        const ragResult = queryKnowledgeBase(microLessonKB, {
            query: lessonQuery,
            topK: 3,
        });

        // Compress into micro lesson (≤120 words)
        const lessonContent = compressChunks(ragResult.chunks, 120);
        const lessonSource = formatSources(ragResult.chunks);

        const lesson: MicroLesson = {
            content: lessonContent || `Today we'll explore ${currentTopic.title}. This concept is fundamental to understanding ${profile.currentModule || 'AI'}.`,
            source: lessonSource || 'AI Learning System',
            topicId: currentTopic.id,
            generatedAt: new Date().toISOString(),
        };

        // Calculate difficulty and select task type
        const difficulty = calculateDifficulty(checkIn, profile.masteryScore, profile.fatigueScore);
        const taskType = selectTaskType(profile.preferredFormat, profile.masteryScore);

        // Select task instruction
        const templates = TASK_TEMPLATES[taskType];
        const instruction = templates[Math.floor(Math.random() * templates.length)];

        const task: ApplicationTask = {
            instruction,
            type: taskType,
            difficulty,
            topicId: currentTopic.id,
        };

        // Store in session state
        const sessionStore = useSessionStore.getState();
        sessionStore.setLesson(lesson);
        sessionStore.setTask(task);

        // Emit session started event
        await emit({
            type: 'session_started',
            payload: {
                checkIn,
                topicId: currentTopic.id,
            }
        });

        console.log('[DailySessionAgent] Session content ready');

        return { lesson, task };
    },

    // Fallback lesson when RAG fails
    getFallbackLesson(topicId: string): MicroLesson {
        return {
            content: 'Today\'s lesson focuses on building fundamental understanding. Take a moment to review what you learned in your last session and consider how these concepts connect.',
            source: 'System Fallback',
            topicId,
            generatedAt: new Date().toISOString(),
        };
    }
};
