"use client";

import React, { useState, useEffect } from "react";
import { Icon } from "@iconify/react";

interface TimelineScrubberProps {
  progress: number;
  onChange: (value: number | ((prev: number) => number)) => void;
}

const MILESTONES = [
  { time: "T-14m 22s", label: "Commit c92f8a1", position: 0.16 },
  { time: "T-11m 05s", label: "Config Drift", position: 0.33 },
  { time: "T-08m 40s", label: "Pricing Cache Miss", position: 0.50 },
  { time: "T-07m 18s", label: "Pool 100/100", position: 0.67 },
  { time: "T-04m 12s", label: "Circuit Breaker", position: 0.84 },
  { time: "T+00m 00s", label: "Triage Alert", position: 1.0 },
];

export function TimelineScrubber({ progress, onChange }: TimelineScrubberProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      onChange((prev) => {
        if (prev >= 1) {
          setIsPlaying(false);
          return 1;
        }
        return Math.min(1, prev + 0.05);
      });
    }, 400);

    return () => clearInterval(interval);
  }, [isPlaying, onChange]);

  const getCurrentTime = () => {
    const minutes = Math.round((1 - progress) * 15);
    if (minutes === 0) return "T+00m 00s (Symptom Alert)";
    return `T-${minutes.toString().padStart(2, "0")}m 00s`;
  };

  return (
    <div className="h-14 border-t border-[#293548] bg-[#111827]/95 backdrop-blur-md px-4 flex items-center justify-between gap-6 text-xs select-none relative z-30">
      {/* Play Controls */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className="p-1.5 rounded bg-[#161f30] hover:bg-[#1e293b] border border-[#293548] text-slate-200 hover:text-white transition-colors"
          title={isPlaying ? "Pause timeline replay" : "Replay incident cascade"}
        >
          <Icon icon={isPlaying ? "solar:pause-bold" : "solar:play-bold"} className="w-3.5 h-3.5 text-[#38bdf8]" />
        </button>
        <button
          onClick={() => {
            setIsPlaying(false);
            onChange(0.16);
          }}
          className="p-1.5 rounded bg-[#161f30] hover:bg-[#1e293b] border border-[#293548] text-slate-400 hover:text-white transition-colors"
          title="Reset to incident trigger"
        >
          <Icon icon="solar:restart-bold" className="w-3.5 h-3.5" />
        </button>

        <div className="flex items-center gap-1.5 font-mono text-[11px] text-slate-300 ml-2">
          <Icon icon="solar:clock-circle-bold-duotone" className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="font-semibold text-white">{getCurrentTime()}</span>
        </div>
      </div>

      {/* Scrubber Track & Markers */}
      <div className="flex-1 relative flex flex-col justify-center">
        <input
          type="range"
          min="0.16"
          max="1"
          step="0.01"
          value={progress}
          onChange={(e) => {
            setIsPlaying(false);
            onChange(parseFloat(e.target.value));
          }}
          className="w-full h-1.5 bg-[#000000] border border-[#293548] rounded-lg appearance-none cursor-pointer accent-[#38bdf8] focus:outline-none"
        />

        {/* Milestone Marks */}
        <div className="flex justify-between w-full mt-1.5 font-mono text-[10px] text-slate-400">
          {MILESTONES.map((m) => {
            const isActive = Math.abs(progress - m.position) < 0.08 || progress >= m.position;
            return (
              <button
                key={m.time}
                onClick={() => {
                  setIsPlaying(false);
                  onChange(m.position);
                }}
                className={`hover:text-white transition-colors flex items-center gap-1 ${
                  isActive ? "text-[#38bdf8] font-semibold" : "text-slate-500"
                }`}
              >
                {isActive && <span className="w-1.5 h-1.5 rounded-full bg-[#38bdf8] shadow-[0_0_6px_#38bdf8]" />}
                {m.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
