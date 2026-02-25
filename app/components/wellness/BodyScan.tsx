'use client';

import { useState, useEffect, useRef } from 'react';

interface BodyScanProps {
    onBack: () => void;
}

const BODY_PARTS = [
    { name: 'Feet & Toes', instruction: 'Bring your attention to your feet. Notice any tension, warmth, or tingling. Gently relax your toes, the arches of your feet, and your ankles.', emoji: '🦶', duration: 15 },
    { name: 'Legs', instruction: 'Move your awareness up to your calves and thighs. Notice any tightness. Let your leg muscles soften and sink into the surface you\'re resting on.', emoji: '🦵', duration: 15 },
    { name: 'Hips & Lower Back', instruction: 'Bring your attention to your hips and lower back. This area often holds stress. Breathe into any tightness and let it release with each exhale.', emoji: '🫀', duration: 15 },
    { name: 'Stomach & Chest', instruction: 'Notice the rise and fall of your breath in your belly and chest. With each exhale, allow your stomach to soften and any tension to melt away.', emoji: '💚', duration: 15 },
    { name: 'Hands & Arms', instruction: 'Bring awareness to your fingertips, palms, and arms. Unclench any fist. Let your arms feel heavy and completely relaxed.', emoji: '🤲', duration: 15 },
    { name: 'Shoulders & Neck', instruction: 'Gently drop your shoulders away from your ears. Roll your neck slightly. Release any tightness in this area — it carries so much of our daily stress.', emoji: '🧣', duration: 15 },
    { name: 'Face & Head', instruction: 'Relax your jaw, unclench your teeth. Soften the muscles around your eyes. Smooth your forehead. Let a gentle calm wash over your entire face.', emoji: '😌', duration: 15 },
    { name: 'Whole Body', instruction: 'Now feel your entire body as one. Notice the sense of calm and heaviness. You are safe. You are present. Take three deep breaths here.', emoji: '✨', duration: 20 },
];

export default function BodyScan({ onBack }: BodyScanProps) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [timeLeft, setTimeLeft] = useState(BODY_PARTS[0].duration);
    const [isComplete, setIsComplete] = useState(false);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const current = BODY_PARTS[currentStep];
    const totalSteps = BODY_PARTS.length;
    const progress = ((currentStep) / totalSteps) * 100;

    useEffect(() => {
        if (isActive && timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else if (isActive && timeLeft === 0) {
            // Move to next step
            if (currentStep < totalSteps - 1) {
                const nextStep = currentStep + 1;
                setCurrentStep(nextStep);
                setTimeLeft(BODY_PARTS[nextStep].duration);
            } else {
                setIsActive(false);
                setIsComplete(true);
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft, currentStep, totalSteps]);

    const start = () => {
        setIsActive(true);
        setCurrentStep(0);
        setTimeLeft(BODY_PARTS[0].duration);
        setIsComplete(false);
    };

    const reset = () => {
        setIsActive(false);
        setCurrentStep(0);
        setTimeLeft(BODY_PARTS[0].duration);
        setIsComplete(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    if (isComplete) {
        return (
            <div className="p-4 sm:p-8 flex flex-col items-center text-center">
                <div className="text-6xl mb-4 animate-bounce">🧘</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Body Scan Complete</h3>
                <p className="text-base mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                    You&apos;ve taken time to reconnect with your body. Notice how you feel now compared to when you started.
                </p>
                <div className="flex gap-3">
                    <button onClick={start} className="px-6 py-3 rounded-xl font-medium text-white" style={{ background: 'var(--accent-primary)' }}>
                        Do It Again
                    </button>
                    <button onClick={onBack} className="px-6 py-3 rounded-xl font-medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        Back to Tools
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                Body Scan Meditation
            </h3>
            <p className="text-sm mb-6 text-center max-w-md" style={{ color: 'var(--text-tertiary)' }}>
                A guided journey through your body to release tension and find calm
            </p>

            {!isActive ? (
                /* Start Screen */
                <div className="flex flex-col items-center gap-6">
                    <div className="grid grid-cols-4 gap-3">
                        {BODY_PARTS.map((part, i) => (
                            <div key={i} className="flex flex-col items-center gap-1 p-3 rounded-xl" style={{ background: 'var(--bg-tertiary)' }}>
                                <span className="text-2xl">{part.emoji}</span>
                                <span className="text-[11px] text-center" style={{ color: 'var(--text-muted)' }}>{part.name}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-sm text-center" style={{ color: 'var(--text-muted)' }}>
                        ~2 minutes · Sit or lie down comfortably
                    </p>
                    <button
                        onClick={start}
                        className="px-8 py-3 rounded-xl text-base font-semibold text-white transition-all"
                        style={{ background: 'var(--accent-primary)' }}
                    >
                        Begin Body Scan
                    </button>
                </div>
            ) : (
                /* Active Scan */
                <div className="w-full max-w-md flex flex-col items-center gap-6">
                    {/* Progress Bar */}
                    <div className="w-full">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium" style={{ color: 'var(--text-muted)' }}>Step {currentStep + 1}/{totalSteps}</span>
                            <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{timeLeft}s</span>
                        </div>
                        <div className="w-full h-2 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                            <div
                                className="h-full rounded-full transition-all duration-500"
                                style={{ width: `${progress + (100 / totalSteps) * ((current.duration - timeLeft) / current.duration)}%`, background: 'var(--accent-primary)' }}
                            />
                        </div>
                    </div>

                    {/* Current Body Part */}
                    <div
                        className="w-full rounded-2xl p-6 sm:p-8 text-center transition-all"
                        style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}
                    >
                        <div className="text-5xl mb-4">{current.emoji}</div>
                        <h4 className="text-lg font-bold mb-3" style={{ color: 'var(--text-primary)' }}>{current.name}</h4>
                        <p className="text-sm leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
                            {current.instruction}
                        </p>
                    </div>

                    {/* Body Preview - dots showing progress */}
                    <div className="flex gap-2">
                        {BODY_PARTS.map((_, i) => (
                            <div
                                key={i}
                                className="w-3 h-3 rounded-full transition-all"
                                style={{
                                    background: i < currentStep ? 'var(--accent-primary)' : i === currentStep ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
                                    opacity: i === currentStep ? 1 : i < currentStep ? 0.5 : 0.3,
                                    transform: i === currentStep ? 'scale(1.3)' : 'scale(1)',
                                }}
                            />
                        ))}
                    </div>

                    <button
                        onClick={reset}
                        className="px-6 py-2.5 rounded-xl text-sm font-medium transition-all"
                        style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                    >
                        Stop & Reset
                    </button>
                </div>
            )}

            {!isActive && (
                <button
                    onClick={onBack}
                    className="mt-6 px-6 py-3 rounded-xl font-medium text-white transition-all"
                    style={{ background: 'var(--accent-primary)' }}
                >
                    Back to Tools
                </button>
            )}
        </div>
    );
}
