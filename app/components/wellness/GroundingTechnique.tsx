'use client';

import { useState } from 'react';

interface GroundingTechniqueProps {
  onBack: () => void;
}

export default function GroundingTechnique({ onBack }: GroundingTechniqueProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isActive, setIsActive] = useState(false);

  const steps = [
    {
      title: "5 Things You Can See",
      instruction: "Look around and identify 5 things you can see. Name them out loud or in your mind.",
      examples: ["A blue pen on the desk", "Sunlight through the window", "A plant in the corner", "Your hands", "A picture on the wall"]
    },
    {
      title: "4 Things You Can Touch",
      instruction: "Notice 4 things you can physically feel or touch right now.",
      examples: ["The texture of your clothes", "The temperature of the air", "The surface you're sitting on", "Your feet in your shoes"]
    },
    {
      title: "3 Things You Can Hear",
      instruction: "Listen carefully and identify 3 sounds around you.",
      examples: ["Birds chirping", "Air conditioning humming", "Traffic in the distance", "Your own breathing"]
    },
    {
      title: "2 Things You Can Smell",
      instruction: "Focus on 2 scents or smells you can detect.",
      examples: ["Fresh air", "Coffee", "Hand soap", "Fabric softener on your clothes"]
    },
    {
      title: "1 Thing You Can Taste",
      instruction: "Notice 1 taste in your mouth or something you can taste.",
      examples: ["Mint from gum", "The taste of water", "Lingering coffee", "Just the taste of your mouth"]
    }
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      setIsActive(false);
      setCurrentStep(0);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    setCurrentStep(0);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentStep(0);
  };

  return (
    <div className="flex flex-col rounded-xl overflow-hidden h-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="p-3 border-b" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>5-4-3-2-1 Grounding Technique</h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Reconnect with the present moment</p>
      </div>

      <div className="flex-1 flex flex-col p-4 sm:p-6 overflow-y-auto">
        {!isActive ? (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Find Your Ground</h3>

              <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>
                  The 5-4-3-2-1 technique helps you reconnect with the present moment by engaging all your senses.
                  This is especially helpful when feeling anxious, overwhelmed, or disconnected.
                </p>

                <div className="space-y-2 text-sm">
                  {[
                    { num: 5, label: 'Things you can see', color: 'var(--accent-primary)' },
                    { num: 4, label: 'Things you can touch', color: '#22c55e' },
                    { num: 3, label: 'Things you can hear', color: '#eab308' },
                    { num: 2, label: 'Things you can smell', color: '#a855f7' },
                    { num: 1, label: 'Thing you can taste', color: '#ec4899' },
                  ].map((item) => (
                    <div key={item.num} className="flex items-center gap-3" style={{ color: item.color }}>
                      <span className="w-6 h-6 rounded-md flex items-center justify-center text-xs font-bold" style={{ background: `${item.color}20`, color: item.color }}>{item.num}</span>
                      <span>{item.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2">
              <button
                onClick={handleStart}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: 'var(--accent-primary)' }}
              >
                Start Grounding
              </button>
              <button
                onClick={onBack}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Progress */}
              <div className="flex justify-center mb-6">
                <div className="flex gap-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className="w-2.5 h-2.5 rounded-full transition-colors"
                      style={{ background: index <= currentStep ? 'var(--accent-primary)' : 'var(--border-primary)' }}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--text-primary)' }}>
                  {steps[currentStep].title}
                </h3>
                <p className="text-sm" style={{ color: 'var(--text-secondary)' }}>
                  {steps[currentStep].instruction}
                </p>
              </div>

              <div className="rounded-xl p-4 mb-6" style={{ background: 'var(--bg-tertiary)', border: '1px solid var(--border-primary)' }}>
                <h4 className="text-sm font-medium mb-3" style={{ color: 'var(--text-primary)' }}>Examples:</h4>
                <ul className="space-y-2">
                  {steps[currentStep].examples.map((example, index) => (
                    <li key={index} className="text-sm flex items-center gap-2" style={{ color: 'var(--text-secondary)' }}>
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--accent-primary)' }} />
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-center text-xs" style={{ color: 'var(--text-muted)' }}>
                Take your time. There&apos;s no rush. Focus on really noticing each thing.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row justify-center gap-2 mt-6">
              <button
                onClick={handleNext}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
                style={{ background: currentStep < steps.length - 1 ? 'var(--accent-primary)' : '#22c55e' }}
              >
                {currentStep < steps.length - 1 ? 'Next Step' : 'Complete'}
              </button>
              <button
                onClick={handleReset}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
              >
                Reset
              </button>
              <button
                onClick={onBack}
                className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
                style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
              >
                Back
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
