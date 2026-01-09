import { useCurriculumProgress } from '../../store/curriculumStore';
import { ProgressBar } from '../shared/ProgressBar';
import './ProgressOverview.css';

export function ProgressOverview() {
    const progress = useCurriculumProgress();

    const stats = [
        {
            label: 'Modules',
            current: progress.completedModules,
            total: progress.totalModules,
            color: 'var(--color-accent-primary)',
        },
        {
            label: 'Topics',
            current: progress.completedTopics,
            total: progress.totalTopics,
            color: 'var(--color-accent-secondary)',
        },
        {
            label: 'Sessions',
            current: progress.completedSessions,
            total: progress.totalSessions,
            color: 'var(--color-accent-tertiary)',
        },
    ];

    return (
        <div className="progress-overview">
            {stats.map((stat) => (
                <div key={stat.label} className="progress-stat">
                    <div className="progress-stat__header">
                        <span className="progress-stat__label">{stat.label}</span>
                        <span className="progress-stat__value">
                            {stat.current} / {stat.total}
                        </span>
                    </div>
                    <ProgressBar
                        value={stat.total > 0 ? (stat.current / stat.total) * 100 : 0}
                    />
                </div>
            ))}
        </div>
    );
}
