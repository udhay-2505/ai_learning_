import React from 'react';

interface CardProps {
    variant?: 'default' | 'glass' | 'glow';
    className?: string;
    children: React.ReactNode;
    onClick?: () => void;
}

export function Card({
    variant = 'default',
    className = '',
    children,
    onClick,
}: CardProps) {
    const classes = [
        'card',
        variant === 'glass' && 'card--glass',
        variant === 'glow' && 'card--glow',
        className,
    ].filter(Boolean).join(' ');

    return (
        <div className={classes} onClick={onClick}>
            {children}
        </div>
    );
}
