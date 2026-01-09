interface FutureSelfStepProps {
    value: string;
    onChange: (value: string) => void;
}

export function FutureSelfStep({ value, onChange }: FutureSelfStepProps) {
    return (
        <div className="step">
            <h2 className="step__title">Your future self</h2>
            <p className="step__subtitle">
                Imagine yourself in a few months. What do you see?
            </p>

            <div className="step__input">
                <label htmlFor="future-self">Complete this sentence:</label>
                <textarea
                    id="future-self"
                    rows={3}
                    placeholder="In 3-6 months, I will be someone who..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                />
            </div>

            {value.trim() && (
                <div className="future-self__preview animate-fade-in">
                    <div className="future-self__label">Your Vision</div>
                    <div className="future-self__text">"{value}"</div>
                </div>
            )}
        </div>
    );
}
