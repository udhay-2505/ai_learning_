// Session Store - Daily Session State Management

import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import type {
    SessionState,
    CheckInData,
    MicroLesson,
    ApplicationTask,
    ReflectionData,
    SessionPhase
} from '../types/session';
import { DEFAULT_SESSION_STATE } from '../types/session';

interface SessionStoreState {
    session: SessionState;

    // Actions
    startSession: () => void;
    submitCheckIn: (checkIn: CheckInData) => void;
    setLesson: (lesson: MicroLesson) => void;
    setTask: (task: ApplicationTask) => void;
    submitReflection: (reflection: ReflectionData) => void;
    advancePhase: () => void;
    resetSession: () => void;
    setPhase: (phase: SessionPhase) => void;
}

const PHASE_ORDER: SessionPhase[] = ['check-in', 'lesson', 'task', 'reflection', 'complete'];

export const useSessionStore = create<SessionStoreState>()(
    immer((set) => ({
        session: { ...DEFAULT_SESSION_STATE },

        startSession: () => {
            set((state) => {
                state.session = {
                    ...DEFAULT_SESSION_STATE,
                    phase: 'check-in',
                    startedAt: new Date().toISOString(),
                };
            });
        },

        submitCheckIn: (checkIn) => {
            set((state) => {
                state.session.checkIn = checkIn;
                state.session.phase = 'lesson';
            });
        },

        setLesson: (lesson) => {
            set((state) => {
                state.session.lesson = lesson;
            });
        },

        setTask: (task) => {
            set((state) => {
                state.session.task = task;
            });
        },

        submitReflection: (reflection) => {
            set((state) => {
                state.session.reflection = reflection;
                state.session.phase = 'complete';
                state.session.completedAt = new Date().toISOString();
            });
        },

        advancePhase: () => {
            set((state) => {
                const currentIndex = PHASE_ORDER.indexOf(state.session.phase);
                if (currentIndex < PHASE_ORDER.length - 1) {
                    state.session.phase = PHASE_ORDER[currentIndex + 1];
                }
            });
        },

        setPhase: (phase) => {
            set((state) => {
                state.session.phase = phase;
            });
        },

        resetSession: () => {
            set((state) => {
                state.session = { ...DEFAULT_SESSION_STATE };
            });
        },
    }))
);

// Selector hooks
export const useCurrentPhase = () => useSessionStore((state) => state.session.phase);
export const useSessionData = () => useSessionStore((state) => state.session);
export const useCheckInData = () => useSessionStore((state) => state.session.checkIn);
export const useLessonData = () => useSessionStore((state) => state.session.lesson);
export const useTaskData = () => useSessionStore((state) => state.session.task);
