import { Button } from '../shared/Button';
import './TodayCTA.css';

interface TodayCTAProps {
    currentTopic: string;
    currentModule: string;
    timeBudget: number;
    onStart: () => void;
}

export function TodayCTA({ currentTopic, currentModule, timeBudget, onStart }: TodayCTAProps) {
    return (
        <div className="today-cta">
            <div className="today-cta__content">
                <div className="today-cta__label">Today's Session</div>
                <h2 className="today-cta__topic">{currentTopic}</h2>
                <div className="today-cta__meta">
                    <span className="today-cta__module">📚 {currentModule}</span>
                    <span className="today-cta__time">⏱️ ~{timeBudget} min</span>
                </div>
            </div>

            <div className="today-cta__action">
                <Button variant="primary" size="lg" onClick={onStart}>
                    🚀 Start Today
                </Button>
            </div>

            {/* Decorative elements */}
            <div className="today-cta__glow" />
        </div>
    );
}
