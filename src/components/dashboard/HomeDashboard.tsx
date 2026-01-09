import { useProfile, useStreakCount, useMasteryScore } from '../../store/learnerStore';
import { useCurriculumProgress, useCurrentTopic, useCurrentModule } from '../../store/curriculumStore';
import { TodayCTA } from './TodayCTA';
import { ProgressOverview } from './ProgressOverview';
import { LearningMap } from './LearningMap';
import { ProgressRing } from '../shared/ProgressBar';
import './HomeDashboard.css';

interface HomeDashboardProps {
    onStartSession: () => void;
}

export function HomeDashboard({ onStartSession }: HomeDashboardProps) {
    const profile = useProfile();
    const streak = useStreakCount();
    const mastery = useMasteryScore();
    const progress = useCurriculumProgress();
    const currentModule = useCurrentModule();
    const currentTopic = useCurrentTopic();

    return (
        <div className="dashboard">
            {/* Header */}
            <header className="dashboard__header">
                <div className="dashboard__greeting animate-fade-in-up">
                    <h1>Welcome back! 👋</h1>
                    <p className="dashboard__subtitle">
                        Ready for today's AI learning session?
                    </p>
                </div>

                {streak > 0 && (
                    <div className="streak-badge animate-fade-in">
                        <span className="streak-badge__icon">🔥</span>
                        <span>{streak} day streak</span>
                    </div>
                )}
            </header>

            {/* Main CTA */}
            <section className="dashboard__cta animate-fade-in-up" style={{ animationDelay: '100ms' }}>
                <TodayCTA
                    currentTopic={currentTopic?.title ?? 'Your next lesson'}
                    currentModule={currentModule?.title ?? 'Getting Started'}
                    timeBudget={profile.dailyTimeBudget}
                    onStart={onStartSession}
                />
            </section>

            {/* Stats Grid */}
            <section className="dashboard__stats animate-fade-in-up" style={{ animationDelay: '200ms' }}>
                <div className="stat-card">
                    <ProgressRing value={progress.overallProgress} size={80} strokeWidth={6} />
                    <div className="stat-card__info">
                        <div className="stat-card__label">Overall Progress</div>
                        <div className="stat-card__value">{progress.completedSessions} of {progress.totalSessions} sessions</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon">🧠</div>
                    <div className="stat-card__info">
                        <div className="stat-card__label">Mastery Score</div>
                        <div className="stat-card__value">{mastery}%</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon">📚</div>
                    <div className="stat-card__info">
                        <div className="stat-card__label">Topics Completed</div>
                        <div className="stat-card__value">{progress.completedTopics} of {progress.totalTopics}</div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-card__icon">⏱️</div>
                    <div className="stat-card__info">
                        <div className="stat-card__label">Daily Commitment</div>
                        <div className="stat-card__value">{profile.dailyTimeBudget} minutes</div>
                    </div>
                </div>
            </section>

            {/* Progress Overview */}
            <section className="dashboard__section animate-fade-in-up" style={{ animationDelay: '300ms' }}>
                <h2 className="dashboard__section-title">Your Progress</h2>
                <ProgressOverview />
            </section>

            {/* Learning Map */}
            <section className="dashboard__section animate-fade-in-up" style={{ animationDelay: '400ms' }}>
                <h2 className="dashboard__section-title">Learning Map</h2>
                <LearningMap />
            </section>

            {/* Future Self Reminder */}
            {profile.futureSelfIdentity && (
                <section className="dashboard__motivation animate-fade-in-up" style={{ animationDelay: '500ms' }}>
                    <div className="motivation-card">
                        <div className="motivation-card__icon">✨</div>
                        <div className="motivation-card__content">
                            <div className="motivation-card__label">Your Vision</div>
                            <div className="motivation-card__text">"{profile.futureSelfIdentity}"</div>
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
