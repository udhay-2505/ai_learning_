import type { GoalHorizon } from '../../types/learner';

interface GoalsStepProps {
    motivation: string;
    goalHorizon?: GoalHorizon;
    onMotivationChange: (value: string) => void;
    onHorizonChange: (value: GoalHorizon) => void;
}

export function GoalsStep({
    motivation,
    goalHorizon,
    onMotivationChange,
    onHorizonChange,
}: GoalsStepProps) {
    return (
        <div className="step">
            <h2 className="step__title">What drives you?</h2>
            <p className="step__subtitle">
                Understanding your motivation shapes your learning path
            </p>

            <div className="step__input">
                <label htmlFor="motivation">Why do you want to learn AI?</label>
                <textarea
                    id="motivation"
                    rows={4}
                    placeholder="e.g., I want to build AI tools for my startup, understand how LLMs work, or transition into an AI engineering role..."
                    value={motivation}
                    onChange={(e) => onMotivationChange(e.target.value)}
                />
            </div>

            <div style={{ marginTop: 'var(--space-6)' }}>
                <label style={{
                    display: 'block',
                    textAlign: 'center',
                    marginBottom: 'var(--space-4)',
                    color: 'var(--color-text-secondary)'
                }}>
                    What's your learning horizon?
                </label>
                <div className="horizon-options">
                    <div
                        className={`horizon-option ${goalHorizon === 3 ? 'selected' : ''}`}
                        onClick={() => onHorizonChange(3)}
                    >
                        <span className="horizon-option__value">3 months</span>
                    </div>
                    <div
                        className={`horizon-option ${goalHorizon === 6 ? 'selected' : ''}`}
                        onClick={() => onHorizonChange(6)}
                    >
                        <span className="horizon-option__value">6 months</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
