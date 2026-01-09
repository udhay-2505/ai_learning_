// Date Utilities

/**
 * Get the difference in days between two date strings
 */
export function getDateDiffInDays(date1: string, date2: string): number {
    const d1 = new Date(date1);
    const d2 = new Date(date2);
    const diffTime = Math.abs(d2.getTime() - d1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

/**
 * Get today's date in YYYY-MM-DD format
 */
export function getTodayString(): string {
    return new Date().toISOString().split('T')[0];
}

/**
 * Check if a date string is today
 */
export function isToday(dateString: string): boolean {
    return dateString === getTodayString();
}

/**
 * Check if a date string is yesterday
 */
export function isYesterday(dateString: string): boolean {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    return dateString === yesterday.toISOString().split('T')[0];
}

/**
 * Format a date string for display
 */
export function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
    });
}

/**
 * Get relative time string (e.g., "2 days ago")
 */
export function getRelativeTime(dateString: string): string {
    const diff = getDateDiffInDays(dateString, getTodayString());

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    if (diff < 30) return `${Math.floor(diff / 7)} weeks ago`;
    return `${Math.floor(diff / 30)} months ago`;
}

/**
 * Check if user was active within the last N days
 */
export function wasActiveRecently(lastActiveDate: string | null, days: number): boolean {
    if (!lastActiveDate) return false;
    return getDateDiffInDays(lastActiveDate, getTodayString()) <= days;
}
