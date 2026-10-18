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
    <header className="h-12 border-b border-[#1e293b] bg-[#0b0f17]/95 backdrop-blur-md px-4 flex items-center justify-between text-xs select-none relative z-40">
      {/* Left: Product & Incident Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono font-medium tracking-wider text-slate-100">
          <Icon icon="solar:pulse-2-bold-duotone" className="w-4 h-4 text-[#38bdf8]" />
          <span className="font-semibold text-slate-100">SYNAPSE</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400 font-normal">THE ACTUAL CAUSE</span>
        </div>

        <div className="h-4 w-[1px] bg-[#1e293b]" />

        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-rose-950/40 text-rose-400 border border-rose-800/60 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
            {severity}
          </span>
          <span className="font-mono text-slate-400">{incidentId}:</span>
          <span className="text-slate-200 font-medium truncate max-w-[280px]">
            {incidentTitle}
          </span>
        </div>
      </div>

      {/* Middle: Monospace Telemetry Strip */}
      <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-slate-400">
        <div className="flex items-center gap-1.5">
          <Icon icon="solar:database-bold-duotone" className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">FalkorDB:</span>
          <span className={falkorConnected ? "text-emerald-400 font-medium flex items-center gap-1" : "text-amber-400 font-medium flex items-center gap-1"}>
            <span className={`w-1.5 h-1.5 rounded-full ${falkorConnected ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
            {falkorConnected ? "CLOUD LIVE" : "SIMULATION"}
          </span>
          <span className="text-slate-500">({queryLatencyMs.toFixed(1)}ms)</span>
        </div>

        <div className="h-3 w-[1px] bg-[#1e293b]" />

        <div className="flex items-center gap-2">
          <Icon icon="solar:share-circle-bold-duotone" className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-400">Topology:</span>
          <span className="text-slate-200 font-medium">
            <NumberTicker value={nodeCount} startValue={nodeCount} /> nodes
          </span>
          <span className="text-slate-600">|</span>
          <span className="text-slate-200 font-medium">
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
                ? "bg-amber-950/50 text-amber-300 border border-amber-800/60 cursor-wait"
                : "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold border border-sky-400/40 cursor-pointer shadow-sm shadow-sky-950/40"
            }`}
          >
            {isTriaging ? (
              <>
                <Icon icon="solar:restart-bold" className="w-3.5 h-3.5 text-amber-400 animate-spin" />
                <span>SWARM TRIAGING...</span>
              </>
            ) : (
              <>
                <Icon icon="solar:bolt-bold-duotone" className="w-3.5 h-3.5 text-white" />
                <span>RUN SWARM TRIAGE</span>
                <BorderBeam size={40} duration={4} colorFrom="#38bdf8" colorTo="#06b6d4" />
              </>
            )}
          </button>
        </div>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1.5 bg-[#161f30] hover:bg-[#1e293b] border border-[#293548] hover:border-[#38bdf8]/50 rounded text-slate-300 hover:text-white transition-colors"
        >
          <Icon icon="solar:magnifer-bold" className="w-3.5 h-3.5 text-[#38bdf8]" />
          <span className="font-sans text-[11px]">Command Palette</span>
          <kbd className="font-mono text-[10px] bg-[#0b0f17] border border-[#293548] px-1 py-0.5 rounded text-slate-400 flex items-center gap-0.5">
            <Icon icon="solar:command-bold" className="w-2.5 h-2.5" />
            <span>K</span>
          </kbd>
        </button>
      </div>
    </header>
  );
}
