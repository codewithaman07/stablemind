"use client";

import { useState, useEffect } from "react";
// import { FaTools } from 'react-icons/fa';
import BreathingExercise from "../wellness/BreathingExercise";
import JournalPrompt from "../wellness/JournalPrompt";
import DailyAffirmations from "../wellness/DailyAffirmations";
import GroundingTechnique from "../wellness/GroundingTechnique";
import { WellnessTool, wellnessTools } from "../wellness/WellnessToolsConfig";
import { calmingVideos } from "../wellness/CalmingVideos";

export default function ToolsPanel() {
  const [activeTool, setActiveTool] = useState<WellnessTool>(null);

  const handleCloseTool = () => {
    setActiveTool(null);
  };

  // Listen for wellness tool requests from the Chat component
  useEffect(() => {
    const handleOpenWellnessTool = (event: CustomEvent) => {
      const { toolId } = event.detail;
      setActiveTool(toolId as WellnessTool);
    };

    window.addEventListener('openWellnessTool', handleOpenWellnessTool as EventListener);
    
    return () => {
      window.removeEventListener('openWellnessTool', handleOpenWellnessTool as EventListener);
    };
  }, []);

  // Render the correct tool component based on the selected tool
  const renderTool = () => {
    switch (activeTool) {
      case "breathing":
        return <BreathingExercise onBack={handleCloseTool} />;
      case "sounds":
        // Calming Sounds tool with multiple YouTube videos
        return (
          <div className="p-3 md:p-4 text-white max-h-[80vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-3 md:mb-4 text-center">
              Calming Sounds
            </h3>
            
            {calmingVideos.map((video) => (
              <div key={video.id} className="mb-4">
                <h4 className="text-sm md:text-base font-medium mb-2 text-gray-300">
                  {video.title}
                </h4>
                <div className="relative w-full pt-[56.25%] mb-3">
                  <iframe
                    className="absolute top-0 left-0 w-full h-full rounded-lg"
                    src={`https://www.youtube.com/embed/${video.videoId}?${video.params}`}
                    title={video.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            ))}

            <p className="text-xs md:text-sm text-center text-gray-400 mb-4">
              Choose from our collection of calming videos to help you relax and
              reduce stress.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleCloseTool}
                className="px-3 md:px-4 py-1 md:py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg text-sm md:text-base transition-colors"
              >
                Back
              </button>
            </div>
          </div>
        );
      case "grounding":
        return <GroundingTechnique onBack={handleCloseTool} />;
      case "journal":
        return <JournalPrompt onBack={handleCloseTool} />;
      case "affirmations":
        return <DailyAffirmations onBack={handleCloseTool} />;
      default:
        return null;
    }
  };

  // If a tool is active, render it full width
  if (activeTool) {
    return (
      <div className="bg-gray-900 rounded-lg shadow-md overflow-hidden">
        {renderTool()}
      </div>
    );
  }
  // Otherwise render the tool selection buttons
  return (
    <div className="bg-gray-900 rounded-lg p-3 md:p-4">
      <h3 className="text-lg font-semibold mb-4 md:mb-6 flex items-center gap-2 text-purple-400">
        <span className="text-purple-400">🔧</span>
        <span>Tools</span>
      </h3>
      <div className="grid grid-cols-1 gap-3 md:gap-4">
        {wellnessTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as WellnessTool)}
            className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div
              className={`w-8 h-8 md:w-10 md:h-10 ${tool.bgColor} rounded-full flex items-center justify-center ${tool.textColor} text-xl`}
            >
              {tool.icon}
            </div>
            <span className="text-white text-sm md:text-base">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
