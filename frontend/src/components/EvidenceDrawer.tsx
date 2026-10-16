"use client";

import React, { useState } from "react";
import { Node } from "@xyflow/react";
import {
  ShieldAlert,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Terminal,
  Zap,
  Check,
  Code2,
} from "lucide-react";
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
  const nodeData = selectedNode?.data as CauseNodeData | undefined;

  return (
    <aside className="w-[420px] h-full border-l border-zinc-800 bg-zinc-950 flex flex-col text-xs select-none overflow-hidden">
      {/* Drawer Header */}
      <div className="h-12 border-b border-zinc-800 px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-3.5 h-3.5 text-zinc-400" />
          <span className="font-mono font-semibold uppercase tracking-wider text-zinc-200 text-[11px]">
            Evidence & Investigation Ledger
          </span>
        </div>
        <span className="font-mono text-[10px] text-zinc-500">HolmesGPT Taxonomy</span>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5">
        {/* Selected Node Inspector (If Clicked) */}
        {nodeData ? (
          <div className="rounded border border-zinc-800 bg-zinc-900/60 p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-zinc-400 uppercase tracking-wider">
                Inspected Node
              </span>
              <span className="font-mono text-[10px] text-zinc-500">{nodeData.timestamp}</span>
            </div>
            <div className="font-medium text-zinc-100 text-[13px]">{nodeData.label}</div>
            <div className="font-mono text-[11px] text-zinc-300 bg-zinc-950 p-2 rounded border border-zinc-900">
              {nodeData.details || nodeData.subtext}
            </div>
            {nodeData.author && (
              <div className="text-[11px] text-zinc-400">
                Author: <span className="text-zinc-200 font-mono">{nodeData.author}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded border border-dashed border-zinc-800 p-2.5 text-center text-zinc-500 text-[11px]">
            Click any node in the Causal DAG to inspect its properties and logs.
          </div>
        )}

        {/* HolmesGPT 4-Group Taxonomy */}
        <div className="space-y-4">
          {/* 1. Affected */}
          <div>
            <div className="flex items-center gap-1.5 text-red-400 font-mono text-[11px] font-semibold mb-2">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Affected Components ({evidence.affected.length})</span>
            </div>
            <div className="space-y-1.5">
              {evidence.affected.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-red-950/20 border border-red-900/40 text-[11px]"
                >
                  <div className="font-medium text-red-200">{item.name}</div>
                  <div className="font-mono text-zinc-400 text-[10px] mt-0.5">{item.symptom}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Checked, Healthy */}
          <div>
            <div className="flex items-center gap-1.5 text-emerald-400 font-mono text-[11px] font-semibold mb-2">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Checked, Healthy Baselines ({evidence.healthy.length})</span>
            </div>
            <div className="space-y-1.5">
              {evidence.healthy.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-emerald-950/20 border border-emerald-900/40 text-[11px]"
                >
                  <div className="font-medium text-emerald-200">{item.name}</div>
                  <div className="font-mono text-zinc-400 text-[10px] mt-0.5">{item.metric}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Changed Elsewhere */}
          <div>
            <div className="flex items-center gap-1.5 text-amber-400 font-mono text-[11px] font-semibold mb-2">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>Changed Elsewhere ({evidence.changed_elsewhere.length})</span>
            </div>
            <div className="space-y-1.5">
              {evidence.changed_elsewhere.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-amber-950/20 border border-amber-900/40 text-[11px]"
                >
                  <div className="font-medium text-amber-200">{item.name}</div>
                  <div className="font-mono text-zinc-400 text-[10px] mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Not Checked */}
          <div>
            <div className="flex items-center gap-1.5 text-zinc-400 font-mono text-[11px] font-semibold mb-2">
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Not Checked ({evidence.not_checked.length})</span>
            </div>
            <div className="space-y-1.5">
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
        <div className="border-t border-zinc-800 pt-4 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-zinc-300 font-mono text-[11px] font-semibold">
              <Code2 className="w-3.5 h-3.5 text-zinc-400" />
              <span>FalkorDB Causal Cypher</span>
            </div>
            <span className="font-mono text-[10px] text-emerald-400">
              {cypherLatencyMs.toFixed(2)}ms
            </span>
          </div>
          <pre className="p-2.5 rounded bg-zinc-900/90 border border-zinc-800 font-mono text-[10px] text-zinc-300 overflow-x-auto whitespace-pre-wrap leading-relaxed">
            {cypherQuery}
          </pre>
        </div>
      </div>

      {/* 1-Click Remediation Action Footer */}
      <div className="p-3 border-t border-zinc-800 bg-zinc-950">
        <button
          onClick={onExecuteRemediation}
          disabled={isRemediating || remediationSuccess}
          className={`w-full py-2.5 px-3 rounded font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            remediationSuccess
              ? "bg-emerald-950 text-emerald-300 border border-emerald-800 cursor-default"
              : isRemediating
              ? "bg-zinc-800 text-zinc-400 cursor-wait"
              : "bg-red-600 hover:bg-red-500 text-white shadow-sm shadow-red-950 cursor-pointer"
          }`}
        >
          {remediationSuccess ? (
            <>
              <Check className="w-4 h-4 text-emerald-400" />
              <span>MITIGATED & MEMORY CRYSTALLIZED</span>
            </>
          ) : isRemediating ? (
            <>
              <div className="w-3.5 h-3.5 border-2 border-zinc-400 border-t-transparent rounded-full animate-spin" />
              <span>EXECUTING REMEDIATION...</span>
            </>
          ) : (
            <>
              <Zap className="w-4 h-4 fill-current" />
              <span>REMEDIATE: REVERT TO ALLKEYS-LRU</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
