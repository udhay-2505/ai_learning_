import { useState, useEffect } from 'react';
import { useSessionStore, useCurrentPhase, useSessionData } from '../../store/sessionStore';
import { useLearnerStore } from '../../store/learnerStore';
import { dailySessionAgent } from '../../agents/dailySessionAgent';
import { adaptationAgent } from '../../agents/adaptationAgent';
import { CheckInScreen } from './CheckInScreen';
import { MicroLesson } from './MicroLesson';
import { ApplicationTask } from './ApplicationTask';
import { ReflectionScreen } from './ReflectionScreen';
import { SessionComplete } from './SessionComplete';
import type { CheckInData, ReflectionData } from '../../types/session';
import './DailySession.css';

interface DailySessionProps {
    onComplete: () => void;
    onExit: () => void;
}

export function DailySession({ onComplete, onExit }: DailySessionProps) {
    const phase = useCurrentPhase();
    const session = useSessionData();
    const sessionStore = useSessionStore();
    const [isLoading, setIsLoading] = useState(false);
    const [sessionStartTime] = useState(Date.now());

    // Start session on mount
    useEffect(() => {
        sessionStore.startSession();
        return () => {
            // Cleanup if needed
        };
    }, []);

    const handleCheckInSubmit = async (checkIn: CheckInData) => {
        setIsLoading(true);
        try {
            sessionStore.submitCheckIn(checkIn);
            await dailySessionAgent.execute({ checkIn });
        } catch (error) {
            console.error('Failed to generate session content:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleLessonComplete = () => {
        sessionStore.setPhase('task');
    };

    const handleTaskComplete = () => {
        sessionStore.setPhase('reflection');
    };

    const handleReflectionSubmit = async (reflection: ReflectionData) => {
        setIsLoading(true);
        try {
            sessionStore.submitReflection(reflection);

            // Calculate completion time
            const completionTimeMinutes = Math.round((Date.now() - sessionStartTime) / 60000);

            // Trigger adaptation agent
            await adaptationAgent.execute({
                reflection,
                topicId: session.lesson?.topicId ?? '',
                completionTimeMinutes,
            });

            // Update learner state
            const today = new Date().toISOString().split('T')[0];
            await useLearnerStore.getState().markSessionComplete(today);

        } catch (error) {
            console.error('Failed to process reflection:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSessionComplete = () => {
        sessionStore.resetSession();
        onComplete();
    };

    const renderPhase = () => {
        if (isLoading) {
            return (
                <div className="session-loading">
                    <div className="session-loading__spinner" />
                    <p>Preparing your session...</p>
                </div>
            );
        }

        switch (phase) {
            case 'check-in':
                return <CheckInScreen onSubmit={handleCheckInSubmit} />;

            case 'lesson':
                return session.lesson ? (
                    <MicroLesson lesson={session.lesson} onComplete={handleLessonComplete} />
                ) : (
                    <div className="session-loading">Loading lesson...</div>
                );

            case 'task':
                return session.task ? (
                    <ApplicationTask task={session.task} onComplete={handleTaskComplete} />
                ) : (
                    <div className="session-loading">Loading task...</div>
                );

            case 'reflection':
                return <ReflectionScreen onSubmit={handleReflectionSubmit} />;

            case 'complete':
                return <SessionComplete onContinue={handleSessionComplete} />;

            default:
                return null;
        }
    };

    // Phase indicator
    const phases = ['check-in', 'lesson', 'task', 'reflection', 'complete'];
    const currentIndex = phases.indexOf(phase);

    return (
        <div className="daily-session">
            {/* Header with exit and progress */}
            <header className="session-header">
                <button className="session-header__exit" onClick={onExit}>
                    ← Exit
                </button>

                <div className="session-header__progress">
                    {phases.slice(0, -1).map((p, i) => (
                        <div
                            key={p}
                            className={`session-header__step ${i < currentIndex ? 'complete' : ''
                                } ${i === currentIndex ? 'active' : ''}`}
                        >
                            <div className="session-header__step-dot" />
                            <span className="session-header__step-label">
                                {p === 'check-in' ? 'Check-in' :
                                    p === 'lesson' ? 'Learn' :
                                        p === 'task' ? 'Apply' : 'Reflect'}
                            </span>
                        </div>
                    ))}
                </div>
            </header>

            {/* Phase content */}
            <main className="session-content animate-fade-in-up" key={phase}>
                {renderPhase()}
            </main>
        </div>
    );
}
