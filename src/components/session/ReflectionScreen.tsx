import { useState } from 'react';
import { Button } from '../shared/Button';
import type { ReflectionData, DifficultyRating } from '../../types/session';
import './ReflectionScreen.css';

interface ReflectionScreenProps {
    onSubmit: (data: ReflectionData) => void;
}

export function ReflectionScreen({ onSubmit }: ReflectionScreenProps) {
    const [difficultyRating, setDifficultyRating] = useState<DifficultyRating>(3);
    const [reflectionText, setReflectionText] = useState('');

    const handleSubmit = () => {
        onSubmit({
            difficultyRating,
            reflectionText,
            timestamp: new Date().toISOString(),
        });
    };

    const difficultyLabels: Record<DifficultyRating, string> = {
        1: 'Too Easy',
        2: 'Easy',
        3: 'Just Right',
        4: 'Challenging',
        5: 'Too Hard',
    };

    const difficultyEmojis: Record<DifficultyRating, string> = {
        1: '😌',
        2: '🙂',
        3: '👍',
        4: '🤔',
        5: '😰',
    };

    return (
        <div className="phase-screen reflection">
            <h2 className="phase-screen__title">Reflect on Your Session</h2>
            <p className="phase-screen__subtitle">
                Your feedback helps us personalize future sessions
            </p>

            <div className="phase-screen__content">
                {/* Difficulty Rating */}
                <div className="reflection__section">
                    <label className="reflection__label">
                        How was the difficulty level?
                    </label>
                    <div className="rating-input">
                        {([1, 2, 3, 4, 5] as DifficultyRating[]).map((rating) => (
                            <button
                                key={rating}
                                className={`rating-input__option ${difficultyRating === rating ? 'selected' : ''
                                    }`}
                                onClick={() => setDifficultyRating(rating)}
                                title={difficultyLabels[rating]}
                            >
                                {difficultyEmojis[rating]}
                            </button>
                        ))}
                    </div>
                    <div className="reflection__rating-label">
                        {difficultyLabels[difficultyRating]}
                    </div>
                </div>

                {/* Reflection Text */}
                <div className="reflection__section">
                    <label className="reflection__label" htmlFor="reflection-text">
                        What's one key insight from today? (Optional)
                    </label>
                    <textarea
                        id="reflection-text"
                        className="reflection__input"
                        placeholder="Write your thoughts here..."
                        rows={4}
                        value={reflectionText}
                        onChange={(e) => setReflectionText(e.target.value)}
                    />
                </div>
            </div>

            <div className="phase-screen__actions">
                <Button variant="primary" size="lg" onClick={handleSubmit}>
                    Complete Session ✓
                </Button>
            </div>
        </div>
    );
}
