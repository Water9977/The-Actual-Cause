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
    <aside className="w-[420px] h-full border-l border-[#293548] bg-[#111827]/95 backdrop-blur-md flex flex-col text-xs select-none overflow-hidden z-30">
      {/* Drawer Header */}
      <div className="h-12 border-b border-[#293548] px-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon icon="solar:document-text-bold-duotone" className="w-4 h-4 text-[#38bdf8]" />
          <span className="font-mono font-medium uppercase tracking-wider text-slate-100 text-[11px]">
            Investigation Ledger
          </span>
        </div>
        <span className="font-mono text-[10px] text-slate-400">HolmesGPT Taxonomy</span>
      </div>

      {/* Main Drawer Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Selected Node Inspector (If Clicked) */}
        {nodeData ? (
          <div className="rounded border border-[#293548] bg-[#161f30] p-3 space-y-2">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Icon icon="solar:target-bold-duotone" className="w-3.5 h-3.5 text-[#38bdf8]" />
                <span>Inspected Node</span>
              </span>
              <span className="font-mono text-[10px] text-slate-500">{nodeData.timestamp}</span>
            </div>
            <div className="font-medium text-white text-[13px]">{nodeData.label}</div>
            <div className="font-mono text-[11px] text-slate-300 bg-[#000000] p-2 rounded border border-[#293548]">
              {nodeData.details || nodeData.subtext}
            </div>
            {nodeData.author && (
              <div className="text-[11px] text-slate-400 flex items-center gap-1">
                <span>Author:</span>
                <span className="text-slate-200 font-mono">{nodeData.author}</span>
              </div>
            )}
          </div>
        ) : (
          <div className="rounded border border-dashed border-[#293548] p-3 text-center text-slate-400 text-[11px] flex items-center justify-center gap-1.5 bg-[#161f30]/40">
            <Icon icon="solar:cursor-bold-duotone" className="w-3.5 h-3.5 text-[#38bdf8]" />
            <span>Click any node in Causal DAG to inspect graph properties.</span>
          </div>
        )}

        {/* HolmesGPT 4-Group Taxonomy */}
        <div className="space-y-3.5">
          {/* 1. Affected */}
          <div>
            <div className="flex items-center gap-1.5 text-[#f43f5e] font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="solar:danger-triangle-bold-duotone" className="w-3.5 h-3.5" />
              <span>Affected Components ({evidence.affected.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.affected.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-[#161f30] border border-[#f43f5e]/30 text-[11px]"
                >
                  <div className="font-medium text-[#f43f5e]">{item.name}</div>
                  <div className="font-mono text-slate-300 text-[10px] mt-0.5">{item.symptom}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 2. Checked, Healthy */}
          <div>
            <div className="flex items-center gap-1.5 text-[#10b981] font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="solar:check-circle-bold-duotone" className="w-3.5 h-3.5" />
              <span>Checked, Healthy Baselines ({evidence.healthy.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.healthy.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-[#161f30] border border-[#10b981]/30 text-[11px]"
                >
                  <div className="font-medium text-[#10b981]">{item.name}</div>
                  <div className="font-mono text-slate-300 text-[10px] mt-0.5">{item.metric}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 3. Changed Elsewhere */}
          <div>
            <div className="flex items-center gap-1.5 text-[#fbbf24] font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="solar:git-branch-bold-duotone" className="w-3.5 h-3.5" />
              <span>Changed Elsewhere ({evidence.changed_elsewhere.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.changed_elsewhere.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-[#161f30] border border-[#fbbf24]/30 text-[11px]"
                >
                  <div className="font-medium text-[#fbbf24]">{item.name}</div>
                  <div className="font-mono text-slate-300 text-[10px] mt-0.5">{item.detail}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 4. Not Checked */}
          <div>
            <div className="flex items-center gap-1.5 text-slate-400 font-mono text-[11px] font-semibold mb-1.5">
              <Icon icon="solar:question-circle-bold-duotone" className="w-3.5 h-3.5" />
              <span>Not Checked ({evidence.not_checked.length})</span>
            </div>
            <div className="space-y-1">
              {evidence.not_checked.map((item) => (
                <div
                  key={item.name}
                  className="p-2 rounded bg-[#161f30]/60 border border-[#293548] text-[11px]"
                >
                  <div className="font-medium text-slate-300">{item.name}</div>
                  <div className="font-mono text-slate-400 text-[10px] mt-0.5">{item.reason}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* FalkorDB Live Cypher Traversal Panel */}
        <div className="border-t border-[#293548] pt-3.5 space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-slate-200 font-mono text-[11px] font-medium">
              <Icon icon="solar:code-bold-duotone" className="w-3.5 h-3.5 text-[#38bdf8]" />
              <span>FalkorDB Traversal Cypher</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-[#38bdf8]">
                {cypherLatencyMs.toFixed(2)}ms
              </span>
              <button
                onClick={handleCopyCypher}
                className="text-slate-400 hover:text-white p-0.5 rounded transition-colors"
                title="Copy Cypher query"
              >
                <Icon icon={copied ? "solar:check-circle-bold" : "solar:copy-bold"} className="w-3 h-3 text-[#38bdf8]" />
              </button>
            </div>
          </div>
          <pre className="p-2.5 rounded bg-[#000000] border border-[#293548] font-mono text-[10px] text-[#38bdf8] overflow-x-auto whitespace-pre-wrap leading-relaxed select-text">
            {cypherQuery}
          </pre>
        </div>
      </div>

      {/* 1-Click Remediation Action Footer */}
      <div className="p-3 border-t border-[#293548] bg-[#111827] relative">
        <button
          onClick={onExecuteRemediation}
          disabled={isRemediating || remediationSuccess}
          className={`relative overflow-hidden w-full py-2.5 px-3 rounded font-mono text-xs font-semibold flex items-center justify-center gap-2 transition-all ${
            remediationSuccess
              ? "bg-[#10b981]/20 text-[#10b981] border border-[#10b981]/40 cursor-default"
              : isRemediating
              ? "bg-[#1e293b] text-slate-400 cursor-wait"
              : "bg-gradient-to-r from-sky-600 to-cyan-600 hover:from-sky-500 hover:to-cyan-500 text-white font-semibold border border-sky-400/40 shadow-lg shadow-sky-950/40 cursor-pointer"
          }`}
        >
          {remediationSuccess ? (
            <>
              <Icon icon="solar:check-circle-bold" className="w-4 h-4 text-[#10b981]" />
              <span>MITIGATED & MEMORY CRYSTALLIZED</span>
            </>
          ) : isRemediating ? (
            <>
              <Icon icon="solar:restart-bold" className="w-3.5 h-3.5 text-white animate-spin" />
              <span>EXECUTING REMEDIATION...</span>
            </>
          ) : (
            <>
              <Icon icon="solar:bolt-bold-duotone" className="w-4 h-4 text-white" />
              <span>REMEDIATE: REVERT TO ALLKEYS-LRU</span>
              <BorderBeam size={50} duration={3} colorFrom="#38bdf8" colorTo="#06b6d4" />
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
