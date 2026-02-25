'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

interface PomodoroTimerProps {
    onBack: () => void;
}

type TimerMode = 'focus' | 'shortBreak' | 'longBreak';

const MODES: Record<TimerMode, { label: string; minutes: number; color: string; emoji: string }> = {
    focus: { label: 'Focus', minutes: 25, color: '#ef4444', emoji: '🎯' },
    shortBreak: { label: 'Short Break', minutes: 5, color: '#22c55e', emoji: '☕' },
    longBreak: { label: 'Long Break', minutes: 15, color: '#3b82f6', emoji: '🌊' },
};

export default function PomodoroTimer({ onBack }: PomodoroTimerProps) {
    const [mode, setMode] = useState<TimerMode>('focus');
    const [timeLeft, setTimeLeft] = useState(MODES.focus.minutes * 60);
    const [isRunning, setIsRunning] = useState(false);
    const [completedSessions, setCompletedSessions] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const currentMode = MODES[mode];

    const resetTimer = useCallback((newMode: TimerMode) => {
        setMode(newMode);
        setTimeLeft(MODES[newMode].minutes * 60);
        setIsRunning(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    }, []);

    useEffect(() => {
        if (isRunning && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            setIsRunning(false);
            if (intervalRef.current) clearInterval(intervalRef.current);
            if (mode === 'focus') {
                setCompletedSessions(prev => prev + 1);
                // Auto-switch to break
                const nextMode = (completedSessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
                setTimeout(() => resetTimer(nextMode), 500);
            } else {
                setTimeout(() => resetTimer('focus'), 500);
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isRunning, timeLeft, mode, completedSessions, resetTimer]);

    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    const progress = 1 - (timeLeft / (MODES[mode].minutes * 60));
    const circumference = 2 * Math.PI * 120;

    return (
        <div className="p-4 sm:p-8 flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                Focus Timer
            </h3>
            <p className="text-sm mb-6 text-center" style={{ color: 'var(--text-tertiary)' }}>
                Stay focused, take breaks, repeat. You&apos;ve got this.
            </p>

            {/* Mode Tabs */}
            <div className="flex gap-2 mb-8">
                {(Object.entries(MODES) as [TimerMode, typeof MODES.focus][]).map(([key, val]) => (
                    <button
                        key={key}
                        onClick={() => resetTimer(key)}
                        className="px-4 py-2 rounded-xl text-sm font-medium transition-all"
                        style={{
                            background: mode === key ? `${val.color}20` : 'var(--bg-tertiary)',
                            color: mode === key ? val.color : 'var(--text-tertiary)',
                            border: `1px solid ${mode === key ? `${val.color}40` : 'transparent'}`,
                        }}
                    >
                        {val.emoji} {val.label}
                    </button>
                ))}
            </div>

            {/* Timer Circle */}
            <div className="relative w-64 h-64 mb-8">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 260 260">
                    <circle cx="130" cy="130" r="120" fill="none" stroke="var(--bg-tertiary)" strokeWidth="8" />
                    <circle
                        cx="130" cy="130" r="120"
                        fill="none"
                        stroke={currentMode.color}
                        strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={circumference}
                        strokeDashoffset={circumference * (1 - progress)}
                        className="transition-all duration-1000 ease-linear"
                    />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-bold tabular-nums" style={{ color: 'var(--text-primary)' }}>
                        {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
                    </span>
                    <span className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>{currentMode.label}</span>
                </div>
            </div>

            {/* Controls */}
            <div className="flex gap-3 mb-6">
                <button
                    onClick={() => setIsRunning(!isRunning)}
                    className="px-8 py-3 rounded-xl text-base font-semibold text-white transition-all"
                    style={{ background: currentMode.color }}
                >
                    {isRunning ? '⏸ Pause' : '▶ Start'}
                </button>
                <button
                    onClick={() => resetTimer(mode)}
                    className="px-5 py-3 rounded-xl text-base font-medium transition-all"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                    ↻ Reset
                </button>
            </div>

            {/* Sessions Counter */}
            <div className="flex items-center gap-2 mb-8">
                <span className="text-sm" style={{ color: 'var(--text-muted)' }}>Sessions completed:</span>
                <div className="flex gap-1">
                    {[...Array(4)].map((_, i) => (
                        <div
                            key={i}
                            className="w-3 h-3 rounded-full transition-all"
                            style={{
                                background: i < (completedSessions % 4) ? currentMode.color : 'var(--bg-tertiary)',
                            }}
                        />
                    ))}
                </div>
                <span className="text-sm font-medium" style={{ color: 'var(--text-primary)' }}>{completedSessions}</span>
            </div>

            <button
                onClick={onBack}
                className="px-6 py-3 rounded-xl font-medium text-white transition-all"
                style={{ background: 'var(--accent-primary)' }}
            >
                Back to Tools
            </button>
        </div>
    );
}
