import { useState, useEffect } from 'react';
import { useLearnerStore, useIsOnboarded, useIsLoading } from './store/learnerStore';
import { useCurriculumStore } from './store/curriculumStore';
import { OnboardingFlow } from './components/onboarding';
import { HomeDashboard } from './components/dashboard';
import { DailySession } from './components/session';
import { notificationAgent } from './agents/notificationAgent';
import { ecosystemCuratorAgent } from './agents/ecosystemCuratorAgent';
import { on } from './services/eventBus';
import { curriculumPlannerAgent } from './agents/curriculumPlannerAgent';

type AppView = 'loading' | 'onboarding' | 'dashboard' | 'session';

function App() {
  const [view, setView] = useState<AppView>('loading');
  const isLoading = useIsLoading();
  const isOnboarded = useIsOnboarded();
  const initializeLearner = useLearnerStore((state) => state.initialize);
  const initializeCurriculum = useCurriculumStore((state) => state.initialize);

  // Initialize stores on mount
  useEffect(() => {
    const init = async () => {
      await initializeLearner();
      await initializeCurriculum();

      // Initialize background agents
      await notificationAgent.initialize();
      ecosystemCuratorAgent.initialize();
    };

    init();

    // Set up event listeners
    const unsubOnboarding = on('onboarding_complete', async () => {
      console.log('[App] Onboarding complete, generating curriculum...');
      const profile = useLearnerStore.getState().profile;
      await curriculumPlannerAgent.execute({ profile });
    });

    return () => {
      unsubOnboarding();
      ecosystemCuratorAgent.stop();
    };
  }, []);

  // Update view based on state
  useEffect(() => {
    if (isLoading) {
      setView('loading');
    } else if (!isOnboarded) {
      setView('onboarding');
    } else {
      setView('dashboard');
    }
  }, [isLoading, isOnboarded]);

  const handleOnboardingComplete = () => {
    setView('dashboard');
  };

  const handleStartSession = () => {
    setView('session');
  };

  const handleSessionComplete = () => {
    setView('dashboard');
  };

  const handleSessionExit = () => {
    setView('dashboard');
  };

  // Loading screen
  if (view === 'loading') {
    return (
      <div className="app-loading">
        <div className="app-loading__content">
          <h1 className="app-loading__title">Learnify AI</h1>
          <p className="app-loading__subtitle">Your Personal Learning OS</p>
          <div className="app-loading__spinner" />
        </div>
      </div>
    );
  }

  // Onboarding
  if (view === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  // Daily Session
  if (view === 'session') {
    return (
      <DailySession
        onComplete={handleSessionComplete}
        onExit={handleSessionExit}
      />
    );
  }

  // Dashboard (default)
  return <HomeDashboard onStartSession={handleStartSession} />;
}

export default App;
