'use client';

import { useState, useEffect, useCallback } from 'react';

interface BreathingExerciseProps {
  onBack: () => void;
}

export default function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);

  const getBaseSize = useCallback(() => {
    if (screenWidth < 360) return 140;
    if (screenWidth < 480) return 160;
    if (screenWidth < 768) return 180;
    return 200;
  }, [screenWidth]);

  const getInitialSize = () => {
    if (typeof window === 'undefined') return 200;
    if (window.innerWidth < 360) return 140;
    if (window.innerWidth < 480) return 160;
    if (window.innerWidth < 768) return 180;
    return 200;
  };

  const [size, setSize] = useState(getInitialSize);
  const [text, setText] = useState('Breathe');

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      if (!isAnimating) {
        setSize(getBaseSize());
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [isAnimating, getBaseSize]);

  useEffect(() => {
    if (!isAnimating) return;

    let growInterval: NodeJS.Timeout;
    let shrinkInterval: NodeJS.Timeout;

    const startBreathing = () => {
      setText('Inhale...');
      const baseSize = getBaseSize();
      let currentSize = baseSize;
      const maxSize = baseSize * 1.5;

      growInterval = setInterval(() => {
        currentSize += 5;
        setSize(currentSize);
        if (currentSize >= maxSize) {
          clearInterval(growInterval);
          setText('Hold...');
          setTimeout(() => {
            setText('Exhale...');
            shrinkInterval = setInterval(() => {
              currentSize -= 5;
              setSize(currentSize);
              if (currentSize <= baseSize) {
                clearInterval(shrinkInterval);
                setText('Breathe');
                setTimeout(startBreathing, 1000);
              }
            }, 100);
          }, 2000);
        }
      }, 100);
    };

    startBreathing();

    return () => {
      clearInterval(growInterval);
      clearInterval(shrinkInterval);
    };
  }, [isAnimating, getBaseSize]);

  return (
    <div className="flex flex-col rounded-xl overflow-hidden h-full" style={{ background: 'var(--bg-secondary)' }}>
      <div className="p-3 border-b" style={{ background: 'var(--bg-tertiary)', borderColor: 'var(--border-primary)' }}>
        <h2 className="text-base font-semibold" style={{ color: 'var(--text-primary)' }}>Breathing Exercise</h2>
        <p className="text-xs" style={{ color: 'var(--text-tertiary)' }}>Guided calm breathing</p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-between p-4 sm:p-6 overflow-y-auto">
        <div className="w-full">
          <h3 className="text-lg font-semibold mb-4 text-center" style={{ color: 'var(--text-primary)' }}>Let&apos;s Breathe Together</h3>

          <div className="relative flex items-center justify-center mb-4 h-[200px] sm:h-[250px] md:h-[350px]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div
                className="rounded-full flex items-center justify-center transition-all duration-500"
                style={{
                  width: `${Math.min(size, screenWidth * 0.7)}px`,
                  height: `${Math.min(size, screenWidth * 0.7)}px`,
                  fontSize: `${Math.min(size, screenWidth * 0.7) / 8}px`,
                  background: 'var(--accent-surface)',
                  border: '2px solid var(--accent-border)',
                  color: 'var(--accent-primary)',
                }}
              >
                {text}
              </div>
            </div>
          </div>

          <p className="text-center text-sm mb-4" style={{ color: 'var(--text-tertiary)' }}>
            Follow the circle: Inhale as it grows, exhale as it shrinks
          </p>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-2 w-full mt-4 sticky bottom-2">
          {!isAnimating ? (
            <button
              onClick={() => setIsAnimating(true)}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium text-white transition-all"
              style={{ background: 'var(--accent-primary)' }}
            >
              Start Exercise
            </button>
          ) : (
            <button
              onClick={() => setIsAnimating(false)}
              className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
              style={{ background: 'var(--bg-hover)', color: 'var(--text-primary)' }}
            >
              Pause
            </button>
          )}
          <button
            onClick={onBack}
            className="w-full px-4 py-2.5 rounded-xl text-sm font-medium transition-all"
            style={{ background: 'var(--bg-tertiary)', color: 'var(--text-secondary)', border: '1px solid var(--border-primary)' }}
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
