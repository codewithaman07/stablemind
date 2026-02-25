"use client";

import { useState, useEffect } from "react";
import BreathingExercise from "../wellness/BreathingExercise";
import JournalPrompt from "../wellness/JournalPrompt";
import GroundingTechnique from "../wellness/GroundingTechnique";
import PomodoroTimer from "../wellness/PomodoroTimer";
import BodyScan from "../wellness/BodyScan";
import Visualization from "../wellness/Visualization";
import { WellnessTool, wellnessTools } from "../wellness/WellnessToolsConfig";
import { calmingVideos } from "../wellness/CalmingVideos";

export default function ToolsPanel() {
  const [activeTool, setActiveTool] = useState<WellnessTool>(null);

  const handleCloseTool = () => {
    setActiveTool(null);
  };

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

  const renderTool = () => {
    switch (activeTool) {
      case "breathing":
        return <BreathingExercise onBack={handleCloseTool} />;
      case "sounds":
        return (
          <div className="p-3 md:p-4 max-h-[80vh] overflow-y-auto">
            <h3 className="text-base font-semibold mb-3 text-center" style={{ color: 'var(--text-primary)' }}>
              Calming Sounds
            </h3>

            {calmingVideos.map((video) => (
              <div key={video.id} className="mb-4">
                <h4 className="text-sm font-medium mb-2" style={{ color: 'var(--text-secondary)' }}>
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

            <p className="text-xs text-center mb-4" style={{ color: 'var(--text-tertiary)' }}>
              Choose from our collection of calming videos.
            </p>

            <div className="flex justify-center">
              <button
                onClick={handleCloseTool}
                className="px-4 py-2 rounded-lg text-sm font-medium transition-all text-white"
                style={{ background: 'var(--accent-primary)' }}
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
      case "pomodoro":
        return <PomodoroTimer onBack={handleCloseTool} />;
      case "bodyscan":
        return <BodyScan onBack={handleCloseTool} />;
      case "visualization":
        return <Visualization onBack={handleCloseTool} />;
      default:
        return null;
    }
  };

  if (activeTool) {
    return (
      <div className="rounded-xl overflow-hidden" style={{ background: 'var(--bg-secondary)', border: '1px solid var(--border-primary)' }}>
        {renderTool()}
      </div>
    );
  }

  return (
    <div className="p-3">
      <h3 className="text-sm font-semibold mb-4 flex items-center gap-2 px-1" style={{ color: 'var(--text-tertiary)' }}>
        <span>🛠️</span>
        <span className="uppercase tracking-wider text-xs">Tools</span>
      </h3>
      <div className="flex flex-col gap-1">
        {wellnessTools.map((tool) => (
          <button
            key={tool.id}
            onClick={() => setActiveTool(tool.id as WellnessTool)}
            className="flex items-center gap-3 p-2.5 rounded-lg transition-all"
            style={{ color: 'var(--text-secondary)' }}
            onMouseEnter={e => { e.currentTarget.style.background = 'var(--bg-tertiary)'; e.currentTarget.style.color = 'var(--text-primary)'; }}
            onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center text-base" style={{ background: 'var(--accent-surface)' }}>
              {tool.icon}
            </div>
            <span className="text-sm">{tool.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
