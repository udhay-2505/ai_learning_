// Notification Agent
// Schedules daily reminders and motivational nudges

import { useLearnerStore } from '../store/learnerStore';
import { scheduleOnce, cancelTask } from '../services/scheduler';
import { loadSetting, saveSetting } from '../services/persistence';

interface NotificationSettings {
    enabled: boolean;
    preferredTime: string; // HH:MM format
    lastNotificationDate: string | null;
}

const NOTIFICATION_TASK_ID = 'daily-reminder';
const SETTINGS_KEY = 'notification-settings';

const DEFAULT_SETTINGS: NotificationSettings = {
    enabled: true,
    preferredTime: '09:00',
    lastNotificationDate: null,
};

// Calculate milliseconds until next reminder time
function getMsUntilTime(timeString: string): number {
    const [hours, minutes] = timeString.split(':').map(Number);
    const now = new Date();
    const target = new Date();
    target.setHours(hours, minutes, 0, 0);

    // If time has passed today, schedule for tomorrow
    if (target <= now) {
        target.setDate(target.getDate() + 1);
    }

    return target.getTime() - now.getTime();
}

// Request notification permission
async function requestPermission(): Promise<boolean> {
    if (!('Notification' in window)) {
        console.log('[NotificationAgent] Notifications not supported');
        return false;
    }

    if (Notification.permission === 'granted') {
        return true;
    }

    if (Notification.permission !== 'denied') {
        const permission = await Notification.requestPermission();
        return permission === 'granted';
    }

    return false;
}

// Show a notification
function showNotification(title: string, body: string): void {
    if (Notification.permission === 'granted') {
        new Notification(title, {
            body,
            icon: '/favicon.svg',
            tag: 'daily-reminder',
        });
    }
}

export const notificationAgent = {
    name: 'NotificationAgent',

    async initialize(): Promise<void> {
        const settings = await this.getSettings();

        if (settings.enabled) {
            await this.scheduleNextReminder();
        }
    },

    async getSettings(): Promise<NotificationSettings> {
        const saved = await loadSetting<NotificationSettings>(SETTINGS_KEY);
        return saved ?? DEFAULT_SETTINGS;
    },

    async updateSettings(updates: Partial<NotificationSettings>): Promise<void> {
        const current = await this.getSettings();
        const updated = { ...current, ...updates };
        await saveSetting(SETTINGS_KEY, updated);

        // Reschedule if time changed
        if (updates.preferredTime || updates.enabled !== undefined) {
            if (updated.enabled) {
                await this.scheduleNextReminder();
            } else {
                cancelTask(NOTIFICATION_TASK_ID);
            }
        }
    },

    async scheduleNextReminder(): Promise<void> {
        const settings = await this.getSettings();

        if (!settings.enabled) {
            console.log('[NotificationAgent] Notifications disabled');
            return;
        }

        const hasPermission = await requestPermission();
        if (!hasPermission) {
            console.log('[NotificationAgent] Permission not granted');
            return;
        }

        const msUntil = getMsUntilTime(settings.preferredTime);

        scheduleOnce(NOTIFICATION_TASK_ID, async () => {
            const profile = useLearnerStore.getState().profile;

            // Generate personalized message
            let message = 'Time for your daily AI learning session!';

            if (profile.streakCount > 0) {
                message = `🔥 ${profile.streakCount} day streak! Keep the momentum going with today's lesson.`;
            } else if (profile.skippedDaysCount > 0) {
                message = 'Welcome back! A quick session today will help you get back on track.';
            }

            showNotification('Learnify AI', message);

            // Update last notification date
            await this.updateSettings({
                lastNotificationDate: new Date().toISOString().split('T')[0],
            });

            // Schedule next day's reminder
            await this.scheduleNextReminder();
        }, msUntil);

        console.log(`[NotificationAgent] Reminder scheduled for ${settings.preferredTime}`);
    },

    // Send immediate notification (for testing)
    async sendTestNotification(): Promise<boolean> {
        const hasPermission = await requestPermission();
        if (!hasPermission) return false;

        showNotification('Learnify AI', 'Test notification! 🎉');
        return true;
    }
};
