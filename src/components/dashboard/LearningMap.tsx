import { useCurriculum } from '../../store/curriculumStore';
import './LearningMap.css';

export function LearningMap() {
    const curriculum = useCurriculum();

    if (!curriculum) {
        return (
            <div className="learning-map learning-map--empty">
                <p>Your learning path will appear here after onboarding.</p>
            </div>
        );
    }

    return (
        <div className="learning-map">
            {curriculum.modules.map((module, moduleIndex) => {
                const completedTopics = module.topics.filter(
                    (t) => t.sessions.every((s) => s.completed)
                ).length;
                const totalTopics = module.topics.length;
                const isComplete = completedTopics === totalTopics;
                const isActive = module.unlocked && !isComplete;

                return (
                    <div
                        key={module.id}
                        className={`learning-map__module ${isComplete ? 'complete' : ''
                            } ${isActive ? 'active' : ''} ${!module.unlocked ? 'locked' : ''}`}
                    >
                        <div className="learning-map__module-header">
                            <div className="learning-map__module-number">
                                {isComplete ? '✓' : moduleIndex + 1}
                            </div>
                            <div className="learning-map__module-info">
                                <h3 className="learning-map__module-title">{module.title}</h3>
                                <p className="learning-map__module-progress">
                                    {completedTopics} of {totalTopics} topics
                                </p>
                            </div>
                            {!module.unlocked && (
                                <div className="learning-map__lock">🔒</div>
                            )}
                        </div>

                        {module.unlocked && (
                            <div className="learning-map__topics">
                                {module.topics.map((topic) => {
                                    const completedSessions = topic.sessions.filter(s => s.completed).length;
                                    const isTopicComplete = completedSessions === topic.sessions.length;
                                    const isTopicActive = !isTopicComplete && completedSessions > 0;

                                    return (
                                        <div
                                            key={topic.id}
                                            className={`learning-map__topic ${isTopicComplete ? 'complete' : ''
                                                } ${isTopicActive ? 'active' : ''}`}
                                        >
                                            <div className="learning-map__topic-indicator">
                                                {isTopicComplete ? '✓' : isTopicActive ? '◐' : '○'}
                                            </div>
                                            <div className="learning-map__topic-info">
                                                <span className="learning-map__topic-title">{topic.title}</span>
                                                <span className="learning-map__topic-sessions">
                                                    {completedSessions}/{topic.sessions.length}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
