"use client";

import React, { useEffect } from "react";
import { Command } from "cmdk";
import { Search, Activity, Database, ShieldAlert, Zap, Terminal } from "lucide-react";

interface CommandPaletteProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelectAction: (action: string) => void;
}

export function CommandPalette({
  open,
  onOpenChange,
  onSelectAction,
}: CommandPaletteProps) {
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        onOpenChange(!open);
      }
      if (e.key === "Escape") {
        onOpenChange(false);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800 rounded-lg shadow-2xl overflow-hidden text-xs">
        <Command className="w-full">
          <div className="flex items-center border-b border-zinc-800 px-3">
            <Search className="w-4 h-4 text-zinc-500 mr-2" />
            <Command.Input
              placeholder="Type an investigation command, query, or service..."
              className="w-full h-11 bg-transparent text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none font-mono"
            />
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="p-4 text-center text-zinc-500 text-xs font-mono">
              No matching actions found.
            </Command.Empty>

            <Command.Group heading="Incident Actions" className="text-zinc-500 font-mono text-[10px] px-2 py-1">
              <Command.Item
                onSelect={() => {
                  onSelectAction("remediate");
                  onOpenChange(false);
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <Zap className="w-3.5 h-3.5 text-red-400" />
                <span>Execute 1-Click Remediation (Revert allkeys-lru)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onSelectAction("re-triage");
                  onOpenChange(false);
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>Run Tri-Agent Swarm Re-Triage</span>
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Graph & Cypher Operations" className="text-zinc-500 font-mono text-[10px] px-2 py-1">
              <Command.Item
                onSelect={() => {
                  onSelectAction("betweenness");
                  onOpenChange(false);
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <Database className="w-3.5 h-3.5 text-zinc-400" />
                <span>Run GraphBLAS Betweenness Centrality (Fragility Index)</span>
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onSelectAction("pagerank");
                  onOpenChange(false);
                }}
                className="flex items-center gap-2 px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900 cursor-pointer transition-colors"
              >
                <Terminal className="w-3.5 h-3.5 text-zinc-400" />
                <span>Run GraphBLAS PageRank (Subject Matter Experts)</span>
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
