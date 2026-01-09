import { useState } from 'react';
import { Button } from '../shared/Button';
import { useProfile } from '../../store/learnerStore';
import type { CheckInData, EnergyLevel } from '../../types/session';
import './CheckInScreen.css';

interface CheckInScreenProps {
    onSubmit: (data: CheckInData) => void;
}

export function CheckInScreen({ onSubmit }: CheckInScreenProps) {
    const profile = useProfile();
    const [energyLevel, setEnergyLevel] = useState<EnergyLevel>(3);
    const [timeOverride, setTimeOverride] = useState<number | null>(null);
    const [mentalLoad, setMentalLoad] = useState<'low' | 'medium' | 'high'>('medium');

    const handleSubmit = () => {
        onSubmit({
            energyLevel,
            availableTimeOverride: timeOverride,
            mentalLoad,
            timestamp: new Date().toISOString(),
        });
    };

    const energyEmojis: Record<EnergyLevel, string> = {
        1: '😴',
        2: '😐',
        3: '🙂',
        4: '😊',
        5: '⚡',
    };

    const energyLabels: Record<EnergyLevel, string> = {
        1: 'Very Low',
        2: 'Low',
        3: 'Normal',
        4: 'Good',
        5: 'Energized',
    };

    return (
        <div className="phase-screen check-in">
            <h2 className="phase-screen__title">How are you feeling?</h2>
            <p className="phase-screen__subtitle">
                A quick check-in helps personalize your session
            </p>

            <div className="phase-screen__content">
                {/* Energy Level */}
                <div className="check-in__section">
                    <label className="check-in__label">Energy Level</label>
                    <div className="check-in__energy">
                        {([1, 2, 3, 4, 5] as EnergyLevel[]).map((level) => (
                            <button
                                key={level}
                                className={`check-in__energy-btn ${energyLevel === level ? 'selected' : ''}`}
                                onClick={() => setEnergyLevel(level)}
                            >
                                <span className="check-in__energy-emoji">{energyEmojis[level]}</span>
                                <span className="check-in__energy-label">{energyLabels[level]}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Mental Load */}
                <div className="check-in__section">
                    <label className="check-in__label">Mental Load Today</label>
                    <div className="check-in__mental-load">
                        {(['low', 'medium', 'high'] as const).map((load) => (
                            <button
                                key={load}
                                className={`check-in__load-btn ${mentalLoad === load ? 'selected' : ''}`}
                                onClick={() => setMentalLoad(load)}
                            >
                                {load === 'low' && '🌿 Light'}
                                {load === 'medium' && '⚖️ Normal'}
                                {load === 'high' && '🔥 Heavy'}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Time Override */}
                <div className="check-in__section">
                    <label className="check-in__label">
                        Time Available (default: {profile.dailyTimeBudget} min)
                    </label>
                    <div className="check-in__time">
                        {[10, 15, 20, 30].map((time) => (
                            <button
                                key={time}
                                className={`check-in__time-btn ${(timeOverride ?? profile.dailyTimeBudget) === time ? 'selected' : ''
                                    }`}
                                onClick={() => setTimeOverride(time === profile.dailyTimeBudget ? null : time)}
                            >
                                {time} min
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            <div className="phase-screen__actions">
                <Button variant="primary" size="lg" onClick={handleSubmit}>
                    Start Learning →
                </Button>
            </div>
        </div>
    );
}
