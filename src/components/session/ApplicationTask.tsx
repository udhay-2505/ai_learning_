import { useState } from 'react';
import { Button } from '../shared/Button';
import type { ApplicationTask as TaskType } from '../../types/session';
import './ApplicationTask.css';

interface ApplicationTaskProps {
    task: TaskType;
    onComplete: () => void;
}

export function ApplicationTask({ task, onComplete }: ApplicationTaskProps) {
    const [response, setResponse] = useState('');

    const taskTypeLabels = {
        explain: 'Explain',
        implement: 'Implement',
        analyze: 'Analyze',
    };

    const taskTypeEmojis = {
        explain: '✏️',
        implement: '⌨️',
        analyze: '🔍',
    };

    const canSubmit = response.trim().length >= 20; // Minimum 20 chars

    return (
        <div className="phase-screen application-task">
            <h2 className="phase-screen__title">Apply What You Learned</h2>
            <p className="phase-screen__subtitle">
                Put your understanding into practice
            </p>

            <div className="phase-screen__content">
                <div className="task-card">
                    <div className="task-card__header">
                        <span className="task-card__badge">
                            {taskTypeEmojis[task.type]} {taskTypeLabels[task.type]}
                        </span>
                        <span className="task-card__difficulty">
                            {'★'.repeat(task.difficulty)}{'☆'.repeat(5 - task.difficulty)}
                        </span>
                    </div>
                    <p className="task-card__instruction">{task.instruction}</p>
                </div>

                <div className="task-response">
                    <label htmlFor="task-response" className="task-response__label">
                        Your Response
                    </label>
                    <textarea
                        id="task-response"
                        className="task-response__input"
                        placeholder="Write your response here..."
                        rows={6}
                        value={response}
                        onChange={(e) => setResponse(e.target.value)}
                    />
                    <div className="task-response__hint">
                        {response.length < 20 ? (
                            <span className="task-response__hint--warning">
                                Write at least 20 characters ({20 - response.length} more needed)
                            </span>
                        ) : (
                            <span className="task-response__hint--success">
                                ✓ Looking good! ({response.length} characters)
                            </span>
                        )}
                    </div>
                </div>
            </div>

            <div className="phase-screen__actions">
                <Button
                    variant="primary"
                    size="lg"
                    onClick={onComplete}
                    disabled={!canSubmit}
                >
                    Submit & Continue →
                </Button>
            </div>
        </div>
    );
}
