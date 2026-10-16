"use client";

import React, { useState } from "react";
import { Node } from "@xyflow/react";
import { Icon } from "@iconify/react";
import { BorderBeam } from "@/components/ui/border-beam";
import { CauseNodeData } from "./CauseNode";

interface EvidenceData {
  affected: { name: string; symptom: string }[];
  healthy: { name: string; metric: string }[];
  changed_elsewhere: { name: string; detail: string }[];
  not_checked: { name: string; reason: string }[];
}

interface EvidenceDrawerProps {
  selectedNode: Node | null;
  evidence: EvidenceData;
  cypherQuery: string;
  cypherLatencyMs: number;
  onExecuteRemediation: () => Promise<void>;
  isRemediating: boolean;
  remediationSuccess: boolean;
}

export function EvidenceDrawer({
  selectedNode,
  evidence,
  cypherQuery,
  cypherLatencyMs,
  onExecuteRemediation,
  isRemediating,
  remediationSuccess,
}: EvidenceDrawerProps) {
  const [copied, setCopied] = useState(false);
  const nodeData = selectedNode?.data as CauseNodeData | undefined;

  const handleCopyCypher = () => {
    navigator.clipboard.writeText(cypherQuery);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <aside className="w-[420px] h-full border-l border-zinc-800/80 bg-zinc-950/95 backdrop-blur-md flex flex-col text-xs select-none overflow-hidden z-30">
      {/* Drawer Header */}
      <div className="h-12 border-b border-zinc-800/80 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="ph:terminal-window-light" className="w-4 h-4 text-zinc-400" />
          <span className="font-mono font-medium uppercase tracking-wider text-zinc-200 text-[11px]">
            Investigation Ledger
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500">HolmesGPT Taxonomy</span>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Selected Node Inspector (If Clicked) */}
        {nodeData ? (
          <div className="rounded border border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon icon="ph:crosshair-light" className="w-3 h-3 text-zinc-500" />
                <span>Inspected Node</span>
              </span>
              <span className="font-mono text-[10px] text-zinc-500">{nodeData.timestamp}</span>
            </div>
            <div className="font-medium text-zinc-100 text-[13px]">{nodeData.label}</div>
            <div className="font-mono text-[11px] text-zinc-300 bg-zinc-950/90 p-2 rounded border border-zinc-800/80">
              {nodeData.details || nodeData.subtext}
            </div>
            {nodeData.author && (
              <div className="text-[11px] text-zinc-400 flex items-center gap-1">
                <span>Author:</span>
                <span className="text-zinc-200 font-mono">{nodeData.author}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded border border-dashed border-zinc-800/80 p-2.5 text-center text-zinc-500 text-[11px] flex items-center justify-center gap-1.5">
            <Icon icon="ph:cursor-click-light" className="w-3.5 h-3.5 text-zinc-600" />
            <span>Click any node in Causal DAG to inspect graph properties.</span>
          </div>
        )}

        {/* HolmesGPT 4-Group Taxonomy */}
        <div className="space-y-3.5">
          {/* 1. Affected */}
          <div>
            <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="ph:shield-warning-light" className="w-3.5 h-3.5" />
              <span>Affected Components ({evidence.affected.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.affected.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-red-950/15 border border-red-900/40 text-[11px]"
                >
                  <div className="font-medium text-red-300">{item.name}</div>
                  <div className="font-mono text-zinc-400 text-[10px] mt-0.5">{item.symptom}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Checked, Healthy */}
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="ph:check-circle-light" className="w-3.5 h-3.5" />
              <span>Checked, Healthy Baselines ({evidence.healthy.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.healthy.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-emerald-950/15 border border-emerald-900/40 text-[11px]"
                >
                  <div className="font-medium text-emerald-300">{item.name}</div>
                  <div className="font-mono text-zinc-400 text-[10px] mt-0.5">{item.metric}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Changed Elsewhere */}
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="ph:git-diff-light" className="w-3.5 h-3.5" />
              <span>Changed Elsewhere ({evidence.changed_elsewhere.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.changed_elsewhere.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-amber-950/15 border border-amber-900/40 text-[11px]"
                >
                  <div className="font-medium text-amber-300">{item.name}</div>
                  <div className="font-mono text-zinc-400 text-[10px] mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Not Checked */}
          <div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="ph:question-light" className="w-3.5 h-3.5 text-zinc-500" />
              <span>Not Checked ({evidence.not_checked.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.not_checked.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-zinc-900/40 border border-zinc-800 text-[11px]"
                >
                  <div className="font-medium text-zinc-300">{item.name}</div>
                  <div className="font-mono text-zinc-500 text-[10px] mt-0.5">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FalkorDB Live Cypher Traversal Panel */}
        <div className="border-t border-zinc-800/80 pt-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] font-medium">
              <Icon icon="ph:code-light" className="w-3.5 h-3.5 text-zinc-400" />
              <span>FalkorDB Traversal Cypher</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-emerald-400">
                {cypherLatencyMs.toFixed(2)}ms
              </span>
              <button
                onClick={handleCopyCypher}
                className="text-zinc-500 hover:text-zinc-300 p-0.5 rounded transition-colors"
                title="Copy Cypher query"
              >
                <Icon icon={copied ? "ph:check-bold" : "ph:copy-light"} className="w-3 h-3" />
              </button>
            </div>
          </div>
          <pre className="p-2.5 rounded bg-zinc-900/90 border border-zinc-800 font-mono text-[10px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
            {cypherQuery}
          </pre>
        </div>
      </div>

      {/* 1-Click Remediation Action Footer */}
      <div className="p-3 border-t border-zinc-800/80 bg-zinc-950 relative">
        <button
          onClick={onExecuteRemediation}
          disabled={isRemediating || remediationSuccess}
          className={`relative overflow-hidden w-full py-2.5 px-3 rounded font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            remediationSuccess
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800 cursor-default"
              : isRemediating
              ? "bg-zinc-800 text-zinc-400 cursor-wait"
              : "bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-950/40 cursor-pointer"
          }`}
        >
          {remediationSuccess ? (
            <>
              <Icon icon="ph:check-circle-light" className="w-4 h-4 text-emerald-400" />
              <span>MITIGATED & MEMORY CRYSTALLIZED</span>
            </>
          ) : isRemediating ? (
            <>
              <Icon icon="ph:spinner-gap-light" className="w-3.5 h-3.5 text-zinc-300 animate-spin" />
              <span>EXECUTING REMEDIATION...</span>
            </>
          ) : (
            <>
              <Icon icon="ph:lightning-light" className="w-4 h-4" />
              <span>REMEDIATE: REVERT TO ALLKEYS-LRU</span>
              <BorderBeam size={50} duration={3} colorFrom="#ffffff" colorTo="#f59e0b" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
