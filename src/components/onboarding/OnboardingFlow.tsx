import { useState } from 'react';
import { PersonaStep } from './PersonaStep';
import { GoalsStep } from './GoalsStep';
import { TimeCommitmentStep } from './TimeCommitmentStep';
import { SkillAssessmentStep } from './SkillAssessmentStep';
import { FutureSelfStep } from './FutureSelfStep';
import { onboardingAgent } from '../../agents/onboardingAgent';
import type { OnboardingInput } from '../../agents/onboardingAgent';
import { curriculumPlannerAgent } from '../../agents/curriculumPlannerAgent';
import { useLearnerStore } from '../../store/learnerStore';
import type { Persona, LearningFormat, SkillLevel, TimeBudget, GoalHorizon } from '../../types/learner';
import './OnboardingFlow.css';

interface OnboardingFlowProps {
    onComplete: () => void;
}

type StepId = 'persona' | 'goals' | 'time' | 'skill' | 'future';

const STEPS: StepId[] = ['persona', 'goals', 'time', 'skill', 'future'];

export function OnboardingFlow({ onComplete }: OnboardingFlowProps) {
    const [currentStep, setCurrentStep] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form state
    const [formData, setFormData] = useState<Partial<OnboardingInput>>({
        persona: undefined,
        motivation: '',
        dailyTimeBudget: 20,
        preferredFormat: 'mixed',
        skillBaseline: 0,
        goalHorizon: 3,
        futureSelfIdentity: '',
    });

    const updateFormData = <K extends keyof OnboardingInput>(
        key: K,
        value: OnboardingInput[K]
    ) => {
        setFormData((prev) => ({ ...prev, [key]: value }));
    };

    const nextStep = () => {
        if (currentStep < STEPS.length - 1) {
            setCurrentStep((prev) => prev + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep((prev) => prev - 1);
        }
    };

    const handleComplete = async () => {
        if (!isFormValid()) return;

        setIsSubmitting(true);
        try {
            // Execute onboarding agent
            await onboardingAgent.execute(formData as OnboardingInput);

            // Get updated profile and generate curriculum
            const profile = useLearnerStore.getState().profile;
            await curriculumPlannerAgent.execute({ profile });

            onComplete();
        } catch (error) {
            console.error('Onboarding failed:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormValid = (): boolean => {
        return !!(
            formData.persona &&
            formData.motivation?.trim() &&
            formData.dailyTimeBudget &&
            formData.preferredFormat &&
            formData.skillBaseline !== undefined &&
            formData.goalHorizon &&
            formData.futureSelfIdentity?.trim()
        );
    };

    const canProceed = (): boolean => {
        const step = STEPS[currentStep];
        switch (step) {
            case 'persona':
                return !!formData.persona;
            case 'goals':
                return !!(formData.motivation?.trim() && formData.goalHorizon);
            case 'time':
                return !!(formData.dailyTimeBudget && formData.preferredFormat);
            case 'skill':
                return formData.skillBaseline !== undefined;
            case 'future':
                return !!formData.futureSelfIdentity?.trim();
            default:
                return false;
        }
    };

    const renderStep = () => {
        const step = STEPS[currentStep];
        switch (step) {
            case 'persona':
                return (
                    <PersonaStep
                        value={formData.persona}
                        onChange={(value) => updateFormData('persona', value as Persona)}
                    />
                );
            case 'goals':
                return (
                    <GoalsStep
                        motivation={formData.motivation ?? ''}
                        goalHorizon={formData.goalHorizon}
                        onMotivationChange={(value) => updateFormData('motivation', value)}
                        onHorizonChange={(value) => updateFormData('goalHorizon', value as GoalHorizon)}
                    />
                );
            case 'time':
                return (
                    <TimeCommitmentStep
                        timeBudget={formData.dailyTimeBudget}
                        format={formData.preferredFormat}
                        onTimeBudgetChange={(value) => updateFormData('dailyTimeBudget', value as TimeBudget)}
                        onFormatChange={(value) => updateFormData('preferredFormat', value as LearningFormat)}
                    />
                );
            case 'skill':
                return (
                    <SkillAssessmentStep
                        value={formData.skillBaseline}
                        onChange={(value) => updateFormData('skillBaseline', value as SkillLevel)}
                    />
                );
            case 'future':
                return (
                    <FutureSelfStep
                        value={formData.futureSelfIdentity ?? ''}
                        onChange={(value) => updateFormData('futureSelfIdentity', value)}
                    />
                );
            default:
                return null;
        }
    };

    const isLastStep = currentStep === STEPS.length - 1;

    return (
        <div className="onboarding">
            <div className="onboarding__container">
                {/* Progress indicator */}
                <div className="onboarding__progress">
                    {STEPS.map((_, index) => (
                        <div
                            key={index}
                            className={`onboarding__progress-dot ${index === currentStep ? 'active' : ''
                                } ${index < currentStep ? 'completed' : ''}`}
                        />
                    ))}
                </div>

                {/* Step content */}
                <div className="onboarding__content animate-fade-in-up" key={currentStep}>
                    {renderStep()}
                </div>

                {/* Navigation */}
                <div className="onboarding__nav">
                    {currentStep > 0 && (
                        <button
                            className="btn btn--ghost"
                            onClick={prevStep}
                            disabled={isSubmitting}
                        >
                            ← Back
                        </button>
                    )}

                    <button
                        className={`btn ${isLastStep ? 'btn--primary btn--lg' : 'btn--primary'}`}
                        onClick={isLastStep ? handleComplete : nextStep}
                        disabled={!canProceed() || isSubmitting}
                    >
                        {isSubmitting ? (
                            'Setting up...'
                        ) : isLastStep ? (
                            '🚀 Begin My Journey'
                        ) : (
                            'Continue →'
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}
