import type { TimeBudget, LearningFormat } from '../../types/learner';

interface TimeCommitmentStepProps {
    timeBudget?: TimeBudget;
    format?: LearningFormat;
    onTimeBudgetChange: (value: TimeBudget) => void;
    onFormatChange: (value: LearningFormat) => void;
}

const TIME_OPTIONS: { value: TimeBudget; label: string }[] = [
    { value: 10, label: 'min' },
    { value: 20, label: 'min' },
    { value: 30, label: 'min' },
];

const FORMAT_OPTIONS: { id: LearningFormat; icon: string; label: string }[] = [
    { id: 'reading', icon: '📖', label: 'Reading' },
    { id: 'video', icon: '🎬', label: 'Video' },
    { id: 'hands-on', icon: '⌨️', label: 'Hands-on' },
    { id: 'mixed', icon: '🎯', label: 'Mixed' },
];

export function TimeCommitmentStep({
    timeBudget,
    format,
    onTimeBudgetChange,
    onFormatChange,
}: TimeCommitmentStepProps) {
    return (
        <div className="step">
            <h2 className="step__title">Your daily commitment</h2>
            <p className="step__subtitle">
                How much time can you dedicate each day?
            </p>

            <div className="time-options">
                {TIME_OPTIONS.map((option) => (
                    <div
                        key={option.value}
                        className={`time-option ${timeBudget === option.value ? 'selected' : ''}`}
                        onClick={() => onTimeBudgetChange(option.value)}
                    >
                        <div className="time-option__value">{option.value}</div>
                        <div className="time-option__unit">{option.label}</div>
                    </div>
                ))}
            </div>

            <div style={{ marginTop: 'var(--space-8)' }}>
                <label style={{
                    display: 'block',
                    textAlign: 'center',
                    marginBottom: 'var(--space-4)',
                    color: 'var(--color-text-secondary)'
                }}>
                    How do you prefer to learn?
                </label>
                <div className="format-options">
                    {FORMAT_OPTIONS.map((option) => (
                        <div
                            key={option.id}
                            className={`format-option ${format === option.id ? 'selected' : ''}`}
                            onClick={() => onFormatChange(option.id)}
                        >
                            <div className="format-option__icon">{option.icon}</div>
                            <div className="format-option__label">{option.label}</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
