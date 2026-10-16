import React from "react";
import { Activity, Database, Terminal, Search, ShieldAlert, Cpu } from "lucide-react";

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
    <header className="h-12 border-b border-zinc-800 bg-zinc-950 px-4 flex items-center justify-between text-xs select-none">
      {/* Left: Product & Incident Identifier */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-mono font-semibold tracking-wider text-zinc-100">
          <Activity className="w-4 h-4 text-emerald-400" />
          <span>SYNAPSE</span>
          <span className="text-zinc-600">/</span>
          <span className="text-zinc-400 font-normal">THE ACTUAL CAUSE</span>
        </div>

        <div className="h-4 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-bold bg-red-950/80 text-red-400 border border-red-800/80">
            {severity}
          </span>
          <span className="font-mono text-zinc-400">{incidentId}:</span>
          <span className="text-zinc-200 font-medium truncate max-w-[280px]">
            {incidentTitle}
          </span>
        </div>
      </div>

      {/* Middle: Crawl4AI-inspired Telemetry strip */}
      <div className="hidden md:flex items-center gap-4 font-mono text-[11px] text-zinc-400">
        <div className="flex items-center gap-1.5">
          <Database className="w-3.5 h-3.5 text-zinc-500" />
          <span>FalkorDB:</span>
          <span className={falkorConnected ? "text-emerald-400 font-medium" : "text-amber-400 font-medium"}>
            {falkorConnected ? "LIVE" : "DISCONNECTED"}
          </span>
          <span className="text-zinc-600">({queryLatencyMs.toFixed(1)}ms)</span>
        </div>

        <div className="h-3 w-[1px] bg-zinc-800" />

        <div className="flex items-center gap-2">
          <Cpu className="w-3.5 h-3.5 text-zinc-500" />
          <span>Graph:</span>
          <span className="text-zinc-200">{nodeCount} nodes</span>
          <span className="text-zinc-600">·</span>
          <span className="text-zinc-200">{relCount} edges</span>
        </div>
      </div>

      {/* Right: Actions & Cmd+K */}
      <div className="flex items-center gap-2">
        <button
          onClick={onTriggerTriage}
          disabled={isTriaging}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded font-mono text-[11px] font-semibold transition-colors ${
            isTriaging
              ? "bg-amber-950/80 text-amber-300 border border-amber-800/80 cursor-wait"
              : "bg-emerald-950 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-800 cursor-pointer"
          }`}
        >
          {isTriaging ? (
            <>
              <div className="w-2.5 h-2.5 border-2 border-amber-400 border-t-transparent rounded-full animate-spin" />
              <span>SWARM TRIAGING...</span>
            </>
          ) : (
            <>
              <Activity className="w-3 h-3 text-emerald-400" />
              <span>RUN SWARM TRIAGE</span>
            </>
          )}
        </button>

        <button
          onClick={onOpenCommandPalette}
          className="flex items-center gap-2 px-2.5 py-1 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Search className="w-3 h-3" />
          <span className="font-sans text-[11px]">Command Palette</span>
          <kbd className="font-mono text-[10px] bg-zinc-800 px-1 py-0.2 rounded text-zinc-400">
            ⌘K
          </kbd>
        </button>
      </div>
    </header>
  );
}
