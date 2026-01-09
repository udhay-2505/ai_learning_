import type { SkillLevel } from '../../types/learner';

interface SkillAssessmentStepProps {
    value?: SkillLevel;
    onChange: (value: SkillLevel) => void;
}

const SKILL_LEVELS: { level: SkillLevel; label: string; desc: string }[] = [
    { level: 0, label: 'Beginner', desc: 'New to AI' },
    { level: 1, label: 'Novice', desc: 'Basic concepts' },
    { level: 2, label: 'Familiar', desc: 'Some experience' },
    { level: 3, label: 'Intermediate', desc: 'Built projects' },
    { level: 4, label: 'Advanced', desc: 'Professional' },
    { level: 5, label: 'Expert', desc: 'Deep expertise' },
];

export function SkillAssessmentStep({ value, onChange }: SkillAssessmentStepProps) {
    return (
        <div className="step">
            <h2 className="step__title">Your current level</h2>
            <p className="step__subtitle">
                Where are you on your AI learning journey?
            </p>

            <div className="skill-slider">
                <div className="skill-slider__track">
                    {SKILL_LEVELS.map(({ level, label, desc }) => (
                        <div
                            key={level}
                            className={`skill-slider__level ${value === level ? 'selected' : ''}`}
                            onClick={() => onChange(level)}
                        >
                            <div className="skill-slider__dot">{level}</div>
                            <div className="skill-slider__label">
                                <strong>{label}</strong>
                                <br />
                                {desc}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
