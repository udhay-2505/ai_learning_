// Scheduler Service - Background Task Scheduling
// Handles weekly ecosystem updates and daily notifications

type ScheduledTask = {
    id: string;
    callback: () => void | Promise<void>;
    intervalMs: number;
    lastRun: number | null;
    timerId: number | null;
};

const tasks = new Map<string, ScheduledTask>();

// Schedule a recurring task
export function scheduleRecurring(
    id: string,
    callback: () => void | Promise<void>,
    intervalMs: number
): void {
    // Cancel existing task with same ID
    if (tasks.has(id)) {
        cancelTask(id);
    }

    const task: ScheduledTask = {
        id,
        callback,
        intervalMs,
        lastRun: null,
        timerId: null,
    };

    // Run immediately, then schedule recurring
    const runTask = async () => {
        task.lastRun = Date.now();
        try {
            await callback();
        } catch (error) {
            console.error(`[Scheduler] Task ${id} failed:`, error);
        }
    };

    runTask();
    task.timerId = window.setInterval(runTask, intervalMs);
    tasks.set(id, task);

    console.log(`[Scheduler] Scheduled task: ${id} (every ${intervalMs}ms)`);
}

// Schedule a one-time task
export function scheduleOnce(
    id: string,
    callback: () => void | Promise<void>,
    delayMs: number
): void {
    if (tasks.has(id)) {
        cancelTask(id);
    }

    const timerId = window.setTimeout(async () => {
        try {
            await callback();
        } catch (error) {
            console.error(`[Scheduler] Task ${id} failed:`, error);
        } finally {
            tasks.delete(id);
        }
    }, delayMs);

    tasks.set(id, {
        id,
        callback,
        intervalMs: delayMs,
        lastRun: null,
        timerId,
    });

    console.log(`[Scheduler] Scheduled one-time task: ${id} (in ${delayMs}ms)`);
}

// Cancel a scheduled task
export function cancelTask(id: string): boolean {
    const task = tasks.get(id);
    if (!task) return false;

    if (task.timerId !== null) {
        window.clearInterval(task.timerId);
        window.clearTimeout(task.timerId);
    }

    tasks.delete(id);
    console.log(`[Scheduler] Cancelled task: ${id}`);
    return true;
}

// Get all active task IDs
export function getActiveTasks(): string[] {
    return Array.from(tasks.keys());
}

// Cancel all tasks (for cleanup)
export function cancelAllTasks(): void {
    for (const id of tasks.keys()) {
        cancelTask(id);
    }
}

// Weekly interval constant (7 days in ms)
export const WEEKLY_INTERVAL = 7 * 24 * 60 * 60 * 1000;

// Daily interval constant (24 hours in ms)
export const DAILY_INTERVAL = 24 * 60 * 60 * 1000;
