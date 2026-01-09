import type { Persona } from '../../types/learner';

interface PersonaStepProps {
    value?: Persona;
    onChange: (value: Persona) => void;
}

const PERSONAS: { id: Persona; icon: string; title: string; desc: string }[] = [
    { id: 'student', icon: '🎓', title: 'Student', desc: 'Learning AI as part of my education' },
    { id: 'developer', icon: '👨‍💻', title: 'Developer', desc: 'Building AI-powered applications' },
    { id: 'founder', icon: '🚀', title: 'Founder', desc: 'Starting or leading an AI venture' },
    { id: 'early-career', icon: '💼', title: 'Early Career', desc: 'Leveling up for career growth' },
];

export function PersonaStep({ value, onChange }: PersonaStepProps) {
    return (
        <div className="step">
            <h2 className="step__title">Who are you?</h2>
            <p className="step__subtitle">
                This helps us tailor your learning experience
            </p>

            <div className="step__options step__options--2col">
                {PERSONAS.map((persona) => (
                    <div
                        key={persona.id}
                        className={`option-card ${value === persona.id ? 'selected' : ''}`}
                        onClick={() => onChange(persona.id)}
                    >
                        <div className="option-card__icon">{persona.icon}</div>
                        <div className="option-card__title">{persona.title}</div>
                        <div className="option-card__desc">{persona.desc}</div>
                    </div>
                ))}
            </div>
        </div>
    );
}
