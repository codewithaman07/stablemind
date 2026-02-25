'use client';

import { useState, useEffect, useRef } from 'react';

interface VisualizationProps {
    onBack: () => void;
}

const SCENES = [
    {
        id: 'beach',
        name: 'Peaceful Beach',
        emoji: '🏖️',
        color: '#0ea5e9',
        steps: [
            { text: 'Close your eyes. Imagine you\'re standing at the edge of a warm, sandy beach.', duration: 8 },
            { text: 'Feel the warm sand between your toes. The sun is gentle on your skin.', duration: 8 },
            { text: 'Listen to the rhythmic sound of waves rolling in... and flowing back out.', duration: 8 },
            { text: 'A gentle breeze carries the fresh scent of the ocean. Breathe it in deeply.', duration: 8 },
            { text: 'You walk slowly along the shoreline. Each step releases a little more tension.', duration: 8 },
            { text: 'The water brushes against your feet — cool and refreshing. You feel completely at peace.', duration: 10 },
        ],
    },
    {
        id: 'forest',
        name: 'Forest Walk',
        emoji: '🌲',
        color: '#22c55e',
        steps: [
            { text: 'Imagine you\'re on a quiet path through an ancient, peaceful forest.', duration: 8 },
            { text: 'Tall trees rise around you, their leaves creating a beautiful green canopy above.', duration: 8 },
            { text: 'Sunlight filters through the leaves, creating dancing patterns of light on the ground.', duration: 8 },
            { text: 'You can hear birds singing softly. A gentle stream trickles nearby.', duration: 8 },
            { text: 'The air is fresh and clean, filled with the scent of pine and earth.', duration: 8 },
            { text: 'You find a mossy clearing and sit down. The forest holds you in complete tranquility.', duration: 10 },
        ],
    },
    {
        id: 'mountain',
        name: 'Mountain Peak',
        emoji: '⛰️',
        color: '#8b5cf6',
        steps: [
            { text: 'You\'re standing on a mountain peak, above the clouds. The air is crisp and clear.', duration: 8 },
            { text: 'Below you, a sea of fluffy white clouds stretches to the horizon.', duration: 8 },
            { text: 'The sky above is the deepest blue you\'ve ever seen. Stars begin to appear.', duration: 8 },
            { text: 'You feel a sense of perspective — your worries seem small from up here.', duration: 8 },
            { text: 'A warm golden light surrounds you. You feel strong, capable, and grounded.', duration: 8 },
            { text: 'Take a deep breath of mountain air. You can handle anything life brings you.', duration: 10 },
        ],
    },
    {
        id: 'garden',
        name: 'Secret Garden',
        emoji: '🌸',
        color: '#ec4899',
        steps: [
            { text: 'You discover a hidden garden behind an old stone wall. A wooden gate opens for you.', duration: 8 },
            { text: 'Inside, flowers of every color bloom in abundance. Their fragrance fills the air.', duration: 8 },
            { text: 'Butterflies dance from blossom to blossom. A fountain gently bubbles in the center.', duration: 8 },
            { text: 'You sit on a warm stone bench. This garden is your private sanctuary.', duration: 8 },
            { text: 'Here, there are no deadlines. No pressure. No expectations. Just peace.', duration: 8 },
            { text: 'You can return to this garden anytime you need. It\'s always here, inside you.', duration: 10 },
        ],
    },
];

export default function Visualization({ onBack }: VisualizationProps) {
    const [selectedScene, setSelectedScene] = useState<typeof SCENES[0] | null>(null);
    const [currentStep, setCurrentStep] = useState(0);
    const [isActive, setIsActive] = useState(false);
    const [isComplete, setIsComplete] = useState(false);
    const [timeLeft, setTimeLeft] = useState(0);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    const startScene = (scene: typeof SCENES[0]) => {
        setSelectedScene(scene);
        setCurrentStep(0);
        setTimeLeft(scene.steps[0].duration);
        setIsActive(true);
        setIsComplete(false);
    };

    useEffect(() => {
        if (!isActive || !selectedScene) return;

        if (timeLeft > 0) {
            intervalRef.current = setInterval(() => {
                setTimeLeft(prev => prev - 1);
            }, 1000);
        } else {
            if (currentStep < selectedScene.steps.length - 1) {
                const next = currentStep + 1;
                setCurrentStep(next);
                setTimeLeft(selectedScene.steps[next].duration);
            } else {
                setIsActive(false);
                setIsComplete(true);
            }
        }

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [isActive, timeLeft, currentStep, selectedScene]);

    const reset = () => {
        setIsActive(false);
        setSelectedScene(null);
        setCurrentStep(0);
        setIsComplete(false);
        if (intervalRef.current) clearInterval(intervalRef.current);
    };

    if (isComplete && selectedScene) {
        return (
            <div className="p-4 sm:p-8 flex flex-col items-center text-center">
                <div className="text-6xl mb-4">🌟</div>
                <h3 className="text-2xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>Journey Complete</h3>
                <p className="text-base mb-6 max-w-md" style={{ color: 'var(--text-secondary)' }}>
                    Take a moment to notice how you feel. Carry this sense of calm with you.
                </p>
                <div className="flex gap-3">
                    <button onClick={reset} className="px-6 py-3 rounded-xl font-medium text-white" style={{ background: 'var(--accent-primary)' }}>
                        Try Another
                    </button>
                    <button onClick={onBack} className="px-6 py-3 rounded-xl font-medium" style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}>
                        Back to Tools
                    </button>
                </div>
            </div>
        );
    }

    if (isActive && selectedScene) {
        const step = selectedScene.steps[currentStep];
        const progress = Math.min(100, ((currentStep * 100) + ((selectedScene.steps[currentStep].duration - timeLeft) / selectedScene.steps[currentStep].duration) * 100) / selectedScene.steps.length);

        return (
            <div className="p-4 sm:p-8 flex flex-col items-center">
                <h3 className="text-lg font-semibold mb-1 text-center" style={{ color: 'var(--text-primary)' }}>
                    {selectedScene.emoji} {selectedScene.name}
                </h3>
                <p className="text-xs mb-6" style={{ color: 'var(--text-muted)' }}>Step {currentStep + 1}/{selectedScene.steps.length}</p>

                {/* Progress */}
                <div className="w-full max-w-md mb-8">
                    <div className="w-full h-1.5 rounded-full" style={{ background: 'var(--bg-tertiary)' }}>
                        <div
                            className="h-full rounded-full transition-all duration-1000 ease-linear"
                            style={{ width: `${progress}%`, background: selectedScene.color }}
                        />
                    </div>
                </div>

                {/* Visualization Text */}
                <div
                    className="w-full max-w-md rounded-2xl p-8 text-center mb-8 transition-all"
                    style={{ background: `${selectedScene.color}10`, border: `1px solid ${selectedScene.color}30` }}
                >
                    <p className="text-lg leading-relaxed italic" style={{ color: 'var(--text-primary)' }}>
                        &ldquo;{step.text}&rdquo;
                    </p>
                </div>

                {/* Timer dots */}
                <div className="flex gap-1 mb-6">
                    {Array.from({ length: selectedScene.steps[currentStep].duration }).map((_, i) => (
                        <div
                            key={i}
                            className="w-1.5 h-1.5 rounded-full transition-all"
                            style={{
                                background: i >= timeLeft ? selectedScene.color : 'var(--bg-tertiary)',
                                opacity: i >= timeLeft ? 0.8 : 0.3,
                            }}
                        />
                    ))}
                </div>

                <button
                    onClick={reset}
                    className="px-5 py-2 rounded-xl text-sm font-medium"
                    style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)' }}
                >
                    Stop
                </button>
            </div>
        );
    }

    // Scene Selection
    return (
        <div className="p-4 sm:p-8 flex flex-col items-center">
            <h3 className="text-xl sm:text-2xl font-semibold mb-2 text-center" style={{ color: 'var(--text-primary)' }}>
                Positive Visualization
            </h3>
            <p className="text-sm mb-8 text-center max-w-md" style={{ color: 'var(--text-tertiary)' }}>
                Choose a scene and let your mind travel to a place of peace and calm
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg w-full mb-8">
                {SCENES.map(scene => (
                    <button
                        key={scene.id}
                        onClick={() => startScene(scene)}
                        className="p-5 rounded-2xl text-left transition-all hover:scale-[1.02]"
                        style={{
                            background: `${scene.color}10`,
                            border: `1px solid ${scene.color}30`,
                        }}
                    >
                        <div className="text-3xl mb-2">{scene.emoji}</div>
                        <h4 className="text-base font-semibold mb-1" style={{ color: 'var(--text-primary)' }}>{scene.name}</h4>
                        <p className="text-xs" style={{ color: 'var(--text-muted)' }}>~{scene.steps.length * 8}s guided journey</p>
                    </button>
                ))}
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
