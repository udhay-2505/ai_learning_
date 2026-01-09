import { useStreakCount, useMasteryScore } from '../../store/learnerStore';
import { Button } from '../shared/Button';
import './SessionComplete.css';

interface SessionCompleteProps {
    onContinue: () => void;
}

export function SessionComplete({ onContinue }: SessionCompleteProps) {
    const streak = useStreakCount();
    const mastery = useMasteryScore();

    return (
        <div className="phase-screen session-complete">
            <div className="session-complete__celebration">
                <div className="session-complete__icon">🎉</div>
                <h2 className="session-complete__title">Session Complete!</h2>
                <p className="session-complete__message">
                    Great work! You're making real progress.
                </p>
            </div>

            <div className="session-complete__stats">
                <div className="session-complete__stat">
                    <div className="session-complete__stat-icon">🔥</div>
                    <div className="session-complete__stat-value">{streak}</div>
                    <div className="session-complete__stat-label">Day Streak</div>
                </div>

                <div className="session-complete__stat">
                    <div className="session-complete__stat-icon">🧠</div>
                    <div className="session-complete__stat-value">{mastery}%</div>
                    <div className="session-complete__stat-label">Mastery</div>
                </div>

                <div className="session-complete__stat">
                    <div className="session-complete__stat-icon">✅</div>
                    <div className="session-complete__stat-value">+1</div>
                    <div className="session-complete__stat-label">Session Done</div>
                </div>
            </div>

            <div className="session-complete__encouragement">
                <p>
                    {streak >= 7
                        ? "🌟 Incredible! A full week of learning!"
                        : streak >= 3
                            ? "🚀 You're building momentum! Keep it up!"
                            : "💪 Every session counts. See you tomorrow!"}
                </p>
            </div>

            <div className="phase-screen__actions">
                <Button variant="primary" size="lg" onClick={onContinue}>
                    Back to Dashboard
                </Button>
            </div>
        </div>
    );
}
