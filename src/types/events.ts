// Event Types - Agent Communication Events

import type { LearnerProfile } from './learner';
import type { Curriculum } from './curriculum';
import type { ReflectionData, CheckInData } from './session';

export type EventType =
    | 'onboarding_complete'
    | 'curriculum_generated'
    | 'session_started'
    | 'session_completed'
    | 'adaptation_complete'
    | 'ecosystem_update';

export interface OnboardingCompleteEvent {
    type: 'onboarding_complete';
    payload: {
        profile: Partial<LearnerProfile>;
    };
}

export interface CurriculumGeneratedEvent {
    type: 'curriculum_generated';
    payload: {
        curriculum: Curriculum;
    };
}

export interface SessionStartedEvent {
    type: 'session_started';
    payload: {
        checkIn: CheckInData;
        topicId: string;
    };
}

export interface SessionCompletedEvent {
    type: 'session_completed';
    payload: {
        reflection: ReflectionData;
        topicId: string;
        completionTime: number; // minutes
    };
}

export interface AdaptationCompleteEvent {
    type: 'adaptation_complete';
    payload: {
        masteryDelta: number;
        fatigueDelta: number;
        streakUpdated: boolean;
    };
}

export interface EcosystemUpdateEvent {
    type: 'ecosystem_update';
    payload: {
        updates: string[];
        relevantToRoadmap: boolean;
    };
}

export type AgentEvent =
    | OnboardingCompleteEvent
    | CurriculumGeneratedEvent
    | SessionStartedEvent
    | SessionCompletedEvent
    | AdaptationCompleteEvent
    | EcosystemUpdateEvent;
