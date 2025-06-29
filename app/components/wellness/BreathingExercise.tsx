'use client';

import { useState, useEffect, useCallback } from 'react';

interface BreathingExerciseProps {
  onBack: () => void;
}

export default function BreathingExercise({ onBack }: BreathingExerciseProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [screenWidth, setScreenWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 1000);
  
  // Calculate appropriate circle size based on screen width
  const getBaseSize = useCallback(() => {
    if (screenWidth < 360) return 140;
    if (screenWidth < 480) return 160;
    if (screenWidth < 768) return 180;
    return 200;
  }, [screenWidth]);
  
  // Calculate initial size based on screen width
  const getInitialSize = () => {
    if (typeof window === 'undefined') return 200;
    if (window.innerWidth < 360) return 140;
    if (window.innerWidth < 480) return 160;
    if (window.innerWidth < 768) return 180;
    return 200;
  };
  
  const [size, setSize] = useState(getInitialSize);
  const [text, setText] = useState('Breathe');
  
  // Adjust for responsive layout
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
      // Also reset size if not animating
      if (!isAnimating) {
        setSize(getBaseSize());
      }
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initialize on first render
    
    return () => window.removeEventListener('resize', handleResize);
  }, [isAnimating, getBaseSize]);

  useEffect(() => {
    if (!isAnimating) return;
    
    let growInterval: NodeJS.Timeout;
    let shrinkInterval: NodeJS.Timeout;
    
    const startBreathing = () => {
      // Grow phase (inhale)
      setText('Inhale...');
      const baseSize = getBaseSize();
      let currentSize = baseSize;
      const maxSize = baseSize * 1.5;
      
      growInterval = setInterval(() => {
        currentSize += 5;
        setSize(currentSize);
        if (currentSize >= maxSize) {
          clearInterval(growInterval);
          // Hold phase
          setText('Hold...');
          setTimeout(() => {
            // Shrink phase (exhale)
            setText('Exhale...');
            shrinkInterval = setInterval(() => {
              currentSize -= 5;
              setSize(currentSize);
              if (currentSize <= baseSize) {
                clearInterval(shrinkInterval);
                // Small pause before restarting
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
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-3 bg-gray-800 text-white">
        <h2 className="text-lg font-medium">Breathing Exercise</h2>
        <p className="text-sm text-gray-400">Guided calm breathing</p>
      </div>
      
      <div className="flex-1 flex flex-col items-center justify-between p-3 sm:p-6 overflow-y-auto">
        <div className="w-full">
          <h3 className="text-xl font-semibold mb-3 sm:mb-4 text-white text-center">Let&apos;s Breathe Together</h3>
          
          {/* Responsive height container - shorter on small screens */}
          <div className="relative flex items-center justify-center mb-4 h-[200px] sm:h-[250px] md:h-[350px]">
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div 
                className="rounded-full bg-blue-900 flex items-center justify-center transition-all duration-500 text-blue-200"
                style={{ 
                  width: `${Math.min(size, screenWidth * 0.7)}px`, 
                  height: `${Math.min(size, screenWidth * 0.7)}px`,
                  fontSize: `${Math.min(size, screenWidth * 0.7)/8}px`,
                }}
              >
                {text}
              </div>
            </div>
          </div>
          
          <p className="text-gray-300 text-center text-sm sm:text-base mb-4 sm:mb-6">
            Follow the circle: Inhale as it grows, exhale as it shrinks
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 w-full mt-2 sm:mt-4 sticky bottom-2">
          {!isAnimating ? (
            <button 
              onClick={() => setIsAnimating(true)}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              Start Exercise
            </button>
          ) : (
            <button 
              onClick={() => setIsAnimating(false)}
              className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
            >
              Pause
            </button>
          )}
          <button 
            onClick={onBack}
            className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
}
