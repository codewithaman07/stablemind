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
      // Finished all steps
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
    <div className="flex flex-col bg-gray-900 rounded-lg shadow-lg overflow-hidden h-full">
      <div className="p-3 bg-gray-800 text-white">
        <h2 className="text-lg font-medium">5-4-3-2-1 Grounding Technique</h2>
        <p className="text-sm text-gray-400">Reconnect with the present moment</p>
      </div>
      
      <div className="flex-1 flex flex-col p-3 sm:p-6 overflow-y-auto">
        {!isActive ? (
          // Introduction screen
          <div className="flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold mb-4 text-white text-center">Find Your Ground</h3>
              
              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <p className="text-gray-300 text-sm sm:text-base mb-4">
                  The 5-4-3-2-1 technique helps you reconnect with the present moment by engaging all your senses. 
                  This is especially helpful when feeling anxious, overwhelmed, or disconnected.
                </p>
                
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-3 text-blue-300">
                    <span className="w-6 h-6 bg-blue-900 rounded-full flex items-center justify-center text-xs font-bold">5</span>
                    <span>Things you can see</span>
                  </div>
                  <div className="flex items-center gap-3 text-green-300">
                    <span className="w-6 h-6 bg-green-900 rounded-full flex items-center justify-center text-xs font-bold">4</span>
                    <span>Things you can touch</span>
                  </div>
                  <div className="flex items-center gap-3 text-yellow-300">
                    <span className="w-6 h-6 bg-yellow-900 rounded-full flex items-center justify-center text-xs font-bold">3</span>
                    <span>Things you can hear</span>
                  </div>
                  <div className="flex items-center gap-3 text-purple-300">
                    <span className="w-6 h-6 bg-purple-900 rounded-full flex items-center justify-center text-xs font-bold">2</span>
                    <span>Things you can smell</span>
                  </div>
                  <div className="flex items-center gap-3 text-pink-300">
                    <span className="w-6 h-6 bg-pink-900 rounded-full flex items-center justify-center text-xs font-bold">1</span>
                    <span>Thing you can taste</span>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
              <button 
                onClick={handleStart}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Start Grounding
              </button>
              <button 
                onClick={onBack}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Back
              </button>
            </div>
          </div>
        ) : (
          // Active grounding session
          <div className="flex-1 flex flex-col justify-between">
            <div>
              {/* Progress indicator */}
              <div className="flex justify-center mb-6">
                <div className="flex space-x-2">
                  {steps.map((_, index) => (
                    <div
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index <= currentStep ? 'bg-indigo-500' : 'bg-gray-600'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold text-white mb-2">
                  {steps[currentStep].title}
                </h3>
                <p className="text-gray-300 text-base sm:text-lg">
                  {steps[currentStep].instruction}
                </p>
              </div>

              <div className="bg-gray-800 rounded-lg p-4 mb-6">
                <h4 className="text-white font-medium mb-3">Examples:</h4>
                <ul className="space-y-2">
                  {steps[currentStep].examples.map((example, index) => (
                    <li key={index} className="text-gray-300 text-sm flex items-center gap-2">
                      <span className="w-1.5 h-1.5 bg-indigo-400 rounded-full"></span>
                      {example}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="text-center text-gray-400 text-sm">
                Take your time. There's no rush. Focus on really noticing each thing.
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row justify-center gap-2 sm:gap-3 mt-6">
              {currentStep < steps.length - 1 ? (
                <button 
                  onClick={handleNext}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                >
                  Next Step
                </button>
              ) : (
                <button 
                  onClick={handleNext}
                  className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
                >
                  Complete
                </button>
              )}
              <button 
                onClick={handleReset}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
              >
                Reset
              </button>
              <button 
                onClick={onBack}
                className="w-full px-4 sm:px-6 py-2.5 sm:py-3 bg-gray-600 hover:bg-gray-500 text-white rounded-lg transition-colors font-medium text-sm sm:text-base"
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
