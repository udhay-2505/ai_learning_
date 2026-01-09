import { Button } from '../shared/Button';
import type { MicroLesson as MicroLessonType } from '../../types/session';
import './MicroLesson.css';

interface MicroLessonProps {
    lesson: MicroLessonType;
    onComplete: () => void;
}

export function MicroLesson({ lesson, onComplete }: MicroLessonProps) {
    return (
        <div className="phase-screen micro-lesson">
            <h2 className="phase-screen__title">Today's Lesson</h2>
            <p className="phase-screen__subtitle">
                Take a moment to absorb this concept
            </p>

            <div className="phase-screen__content">
                <div className="lesson-card">
                    <div className="lesson-card__source">
                        📖 {lesson.source}
                    </div>
                    <div className="lesson-card__content">
                        {lesson.content}
                    </div>
                </div>

                <div className="lesson-tip">
                    <div className="lesson-tip__icon">💡</div>
                    <div className="lesson-tip__text">
                        Read slowly and think about how this connects to what you already know.
                    </div>
                </div>
            </div>

            <div className="phase-screen__actions">
                <Button variant="primary" size="lg" onClick={onComplete}>
                    Got it! Continue →
                </Button>
            </div>
        </div>
    );
}
