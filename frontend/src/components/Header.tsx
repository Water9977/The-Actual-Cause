"use client";

import React from "react";
import { Icon } from "@iconify/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { NumberTicker } from "@/components/ui/number-ticker";

interface HeaderProps {
  incidentId: string;
  incidentTitle: string;
  severity: string;
  falkorConnected: boolean;
  queryLatencyMs: number;
  nodeCount: number;
  relCount: number;
  isTriaging: boolean;
  onTriggerTriage: () => void;
  onOpenCommandPalette: () => void;
}

export function Header({
  incidentId,
  incidentTitle,
  severity,
  falkorConnected,
  queryLatencyMs,
  nodeCount,
  relCount,
  isTriaging,
  onTriggerTriage,
  onOpenCommandPalette,
}: HeaderProps) {
  return (
    <header className="h-12 border-b border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md px-4 flex items-center justify-between text-xs select-none relative z-40">
      {/* Left: Product & Incident Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono font-medium tracking-wider text-zinc-100">
          <Icon icon="ph:pulse-bold" className="w-4 h-4 text-emerald-400" />
          <span className="font-semibold text-zinc-200">SYNAPSE</span>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-400 font-normal">THE ACTUAL CAUSE</span>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-red-950/40 text-red-400 border border-red-800/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            {severity}
          </span>
          <span className="font-mono text-zinc-400">{incidentId}:</span>
          <span className="text-zinc-200 font-medium truncate max-w-[280px]">
            {incidentTitle}
          </span>
        </div>
      </div>

      {/* Middle: High-precision Monospace Telemetry Strip */}
      <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Icon icon="ph:database-light" className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500">FalkorDB:</span>
          <span className={falkorConnected ? "text-emerald-400 font-medium flex items-center gap-1" : "text-amber-400 font-medium flex items-center gap-1"}>
            <span className={`w-1.5 h-1.5 rounded-full ${falkorConnected ? "bg-emerald-500" : "bg-amber-500"}`} />
            {falkorConnected ? "LIVE" : "SIMULATION"}
          </span>
          <span className="text-zinc-600">({queryLatencyMs.toFixed(1)}ms)</span>
        </div>

        <div className="h-3 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <Icon icon="tabler:topology-star-3" className="w-3.5 h-3.5 text-zinc-500" />
          <span className="text-zinc-500">Topology:</span>
          <span className="text-zinc-200 font-medium">
            <NumberTicker value={nodeCount} startValue={nodeCount} /> nodes
          </span>
          <span className="text-zinc-700">|</span>
          <span className="text-zinc-200 font-medium">
            <NumberTicker value={relCount} startValue={relCount} /> edges
          </span>
        </div>
      </div>

      {/* Right: Actions & Cmd+K */}
      <div className="flex items-center gap-2.5">
        <div className="relative">
          <button
            onClick={onTriggerTriage}
            disabled={isTriaging}
            className={`relative overflow-hidden flex items-center gap-1.5 px-3 py-1.5 rounded font-mono text-[11px] font-medium transition-all ${
              isTriaging
                ? "bg-amber-950/40 text-amber-300 border border-amber-800/60 cursor-wait"
                : "bg-zinc-900 hover:bg-zinc-800 text-zinc-100 border border-zinc-700 hover:border-zinc-600 cursor-pointer shadow-sm"
            }`}
          >
            {isTriaging ? (
              <>
                <Icon icon="ph:spinner-gap-light" className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>SWARM TRIAGING...</span>
              </>
            ) : (
              <>
                <Icon icon="ph:lightning-light" className="w-3.5 h-3.5 text-emerald-400" />
                <span>RUN SWARM TRIAGE</span>
                <BorderBeam size={40} duration={4} colorFrom="#10b981" colorTo="#06b6d4" />
              </>
            )}
          </button>
        </div>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-zinc-900/80 hover:bg-zinc-800/90 border border-zinc-800 hover:border-zinc-700 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Icon icon="ph:magnifying-glass-light" className="w-3.5 h-3.5" />
          <span className="font-sans text-[11px]">Command Palette</span>
          <kbd className="font-mono text-[10px] bg-zinc-800/80 border border-zinc-700/60 px-1 py-0.5 rounded text-zinc-400 flex items-center gap-0.5">
            <Icon icon="ph:command-light" className="w-2.5 h-2.5" />
            <span>K</span>
          </kbd>
        </button>
      </div>
    </header>
  );
}
