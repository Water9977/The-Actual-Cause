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
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-start justify-center pt-24 p-4">
      <div className="w-full max-w-xl bg-zinc-950 border border-zinc-800/80 rounded-lg shadow-2xl overflow-hidden text-xs">
        <Command className="w-full">
          <div className="flex items-center border-b border-zinc-800/80 px-3">
            <Icon icon="ph:magnifying-glass-light" className="w-4 h-4 text-zinc-500 mr-2" />
            <Command.Input
              placeholder="Type an investigation command, query, or service..."
              className="w-full h-11 bg-transparent text-zinc-100 placeholder-zinc-500 text-xs focus:outline-none font-mono"
            />
            <kbd className="font-mono text-[9px] bg-zinc-900 border border-zinc-800 px-1 py-0.5 rounded text-zinc-500">
              ESC
            </kbd>
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
                className="flex items-center justify-between px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900/90 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="ph:lightning-light" className="w-4 h-4 text-red-400" />
                  <span>Execute 1-Click Remediation (Revert allkeys-lru)</span>
                </div>
                <Icon icon="ph:arrow-elbow-down-left-light" className="w-3 h-3 text-zinc-600" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onSelectAction("re-triage");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900/90 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="ph:pulse-light" className="w-4 h-4 text-emerald-400" />
                  <span>Run Tri-Agent Swarm Re-Triage</span>
                </div>
                <Icon icon="ph:arrow-elbow-down-left-light" className="w-3 h-3 text-zinc-600" />
              </Command.Item>
            </Command.Group>

            <Command.Group heading="Graph & Cypher Operations" className="text-zinc-500 font-mono text-[10px] px-2 py-1">
              <Command.Item
                onSelect={() => {
                  onSelectAction("betweenness");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900/90 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="ph:database-light" className="w-4 h-4 text-zinc-400" />
                  <span>Run GraphBLAS Betweenness Centrality (Fragility Index)</span>
                </div>
                <Icon icon="ph:arrow-elbow-down-left-light" className="w-3 h-3 text-zinc-600" />
              </Command.Item>

              <Command.Item
                onSelect={() => {
                  onSelectAction("pagerank");
                  onOpenChange(false);
                }}
                className="flex items-center justify-between px-2.5 py-2 rounded text-zinc-200 hover:bg-zinc-900/90 hover:text-white cursor-pointer transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Icon icon="ph:terminal-window-light" className="w-4 h-4 text-zinc-400" />
                  <span>Run GraphBLAS PageRank (Subject Matter Experts)</span>
                </div>
                <Icon icon="ph:arrow-elbow-down-left-light" className="w-3 h-3 text-zinc-600" />
              </Command.Item>
            </Command.Group>
          </Command.List>
        </Command>
      </div>
    </div>
  );
}
