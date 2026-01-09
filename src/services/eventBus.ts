// Event Bus - Agent Communication Layer
// Simple pub/sub system for agent coordination

import type { AgentEvent, EventType } from '../types/events';

type EventHandler<T extends AgentEvent = AgentEvent> = (event: T) => void | Promise<void>;

interface EventBusState {
    handlers: Map<EventType, Set<EventHandler>>;
}

const state: EventBusState = {
    handlers: new Map(),
};

// Subscribe to an event type
export function on<T extends AgentEvent>(
    eventType: T['type'],
    handler: EventHandler<T>
): () => void {
    if (!state.handlers.has(eventType)) {
        state.handlers.set(eventType, new Set());
    }

    const handlers = state.handlers.get(eventType)!;
    handlers.add(handler as EventHandler);

    // Return unsubscribe function
    return () => {
        handlers.delete(handler as EventHandler);
    };
}

// Emit an event to all subscribers
export async function emit<T extends AgentEvent>(event: T): Promise<void> {
    const handlers = state.handlers.get(event.type);

    if (!handlers || handlers.size === 0) {
        console.log(`[EventBus] No handlers for event: ${event.type}`);
        return;
    }

    console.log(`[EventBus] Emitting: ${event.type}`, event.payload);

    // Execute all handlers (concurrent)
    const promises = Array.from(handlers).map(async (handler) => {
        try {
            await handler(event);
        } catch (error) {
            console.error(`[EventBus] Handler error for ${event.type}:`, error);
        }
    });

    await Promise.all(promises);
}

// One-time subscription
export function once<T extends AgentEvent>(
    eventType: T['type'],
    handler: EventHandler<T>
): void {
    const unsubscribe = on<T>(eventType, (event) => {
        unsubscribe();
        handler(event);
    });
}

// Clear all handlers (for testing)
export function clearAllHandlers(): void {
    state.handlers.clear();
}

// Get handler count for debugging
export function getHandlerCount(eventType: EventType): number {
    return state.handlers.get(eventType)?.size ?? 0;
}
