interface ProgressBarProps {
    value: number; // 0-100
    className?: string;
}

export function ProgressBar({ value, className = '' }: ProgressBarProps) {
    const clampedValue = Math.max(0, Math.min(100, value));

    return (
        <div className={`progress-bar ${className}`}>
            <div
                className="progress-bar__fill"
                style={{ width: `${clampedValue}%` }}
            />
        </div>
    );
}

interface ProgressRingProps {
    value: number; // 0-100
    size?: number;
    strokeWidth?: number;
    showText?: boolean;
    className?: string;
}

export function ProgressRing({
    value,
    size = 120,
    strokeWidth = 8,
    showText = true,
    className = '',
}: ProgressRingProps) {
    const clampedValue = Math.max(0, Math.min(100, value));
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (clampedValue / 100) * circumference;

    return (
        <div className={`progress-ring ${className}`} style={{ width: size, height: size }}>
            <svg
                className="progress-ring__circle"
                width={size}
                height={size}
            >
                <defs>
                    <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="50%" stopColor="#8b5cf6" />
                        <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                </defs>
                <circle
                    className="progress-ring__bg"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                />
                <circle
                    className="progress-ring__fill"
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    strokeWidth={strokeWidth}
                    strokeDasharray={circumference}
                    strokeDashoffset={offset}
                />
            </svg>
            {showText && (
                <span className="progress-ring__text">{Math.round(clampedValue)}%</span>
            )}
        </div>
    );
}
