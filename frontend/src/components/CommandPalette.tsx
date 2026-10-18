"use client";

import React, { useEffect } from "react";
import { Command } from "cmdk";
import { Icon } from "@iconify/react";

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
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-[#111827] border border-[#293548] rounded-lg shadow-2xl overflow-hidden text-xs">
        <Command className="w-full">
          <div className="flex items-center border-b border-[#293548] px-3">
            <Icon icon="solar:magnifer-bold" className="w-4 h-4 text-[#38bdf8] mr-2" />
            <Command.Input
              placeholder="Type an investigation command, query, or service..."
              className="w-full h-11 bg-transparent text-white placeholder-slate-400 text-xs focus:outline-none font-mono"
            />
            <kbd className="font-mono text-[9px] bg-[#0b0f17] border border-[#293548] px-1.5 py-0.5 rounded text-slate-400">
              ESC
            </kbd>
          </div>

          <Command.List className="max-h-72 overflow-y-auto p-2 space-y-1">
            <Command.Empty className="p-4 text-center text-slate-400 text-xs font-mono">
              No matching actions found.
            </Command.Empty>

            <Command.Group heading="Incident Actions" className="text-[#38bdf8] font-mono text-[10px] px-2 py-1 uppercase tracking-wider font-semibold">
              <Command.Item
                onSelect={() => {
                  onSelectAction("remediate");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-slate-200 hover:bg-[#161f30] hover:text-white cursor-pointer transition-colors border border-transparent hover:border-[#293548]"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:bolt-bold-duotone" className="w-4 h-4 text-[#38bdf8]" />
                  <span>Execute 1-Click Remediation (Revert allkeys-lru)</span>
                </div>
                <Icon icon="solar:corner-down-left-bold" className="w-3 h-3 text-slate-500" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onSelectAction("re-triage");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-slate-200 hover:bg-[#161f30] hover:text-white cursor-pointer transition-colors border border-transparent hover:border-[#293548]"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:pulse-2-bold-duotone" className="w-4 h-4 text-[#10b981]" />
                  <span>Run Tri-Agent Swarm Re-Triage</span>
                </div>
                <Icon icon="solar:corner-down-left-bold" className="w-3 h-3 text-slate-500" />
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Graph & Cypher Operations" className="text-[#38bdf8] font-mono text-[10px] px-2 py-1 uppercase tracking-wider font-semibold">
              <Command.Item
                onSelect={() => {
                  onSelectAction("betweenness");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-slate-200 hover:bg-[#161f30] hover:text-white cursor-pointer transition-colors border border-transparent hover:border-[#293548]"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:database-bold-duotone" className="w-4 h-4 text-[#38bdf8]" />
                  <span>Run GraphBLAS Betweenness Centrality (Fragility Index)</span>
                </div>
                <Icon icon="solar:corner-down-left-bold" className="w-3 h-3 text-slate-500" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onSelectAction("pagerank");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-slate-200 hover:bg-[#161f30] hover:text-white cursor-pointer transition-colors border border-transparent hover:border-[#293548]"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="solar:graph-bold-duotone" className="w-4 h-4 text-[#fbbf24]" />
                  <span>Run GraphBLAS PageRank (Subject Matter Experts)</span>
                </div>
                <Icon icon="solar:corner-down-left-bold" className="w-3 h-3 text-slate-500" />
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
