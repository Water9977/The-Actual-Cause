"use client";

import React from "react";
import { Handle, Position } from "@xyflow/react";
import { Icon } from "@iconify/react";
import { BorderBeam } from "@/components/ui/border-beam";

export interface CauseNodeData {
  label: string;
  kind: "Commit" | "ConfigDrift" | "Service" | "Database" | "Infrastructure";
  subtext: string;
  author?: string;
  status: "root_cause" | "degraded" | "affected" | "healthy";
  timestamp: string;
  details?: string;
}

export function CauseNode({ data, selected }: { data: CauseNodeData; selected?: boolean }) {
  const isRootCause = data.status === "root_cause";
  const isDegraded = data.status === "degraded";
  const isHealthy = data.status === "healthy";

  const getStatusBorder = () => {
    if (selected) return "ring-1 ring-[#38bdf8] border-[#38bdf8]";
    if (isRootCause) return "border-[#f43f5e] shadow-[0_0_15px_rgba(244,63,94,0.25)]";
    if (isDegraded) return "border-[#fbbf24]/70";
    if (isHealthy) return "border-[#10b981]/50";
    return "border-[#293548]";
  };

  const getStatusBadge = () => {
    if (isRootCause) return "bg-[#f43f5e]/15 text-[#f43f5e] border-[#f43f5e]/40";
    if (isDegraded) return "bg-[#fbbf24]/15 text-[#fbbf24] border-[#fbbf24]/40";
    if (isHealthy) return "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/40";
    return "bg-[#1e293b] text-slate-300 border-[#293548]";
  };

  const getIcon = () => {
    switch (data.kind) {
      case "Commit":
        return <Icon icon="solar:git-commit-bold-duotone" className="w-3.5 h-3.5 text-[#38bdf8]" />;
      case "ConfigDrift":
        return <Icon icon="solar:tuning-bold-duotone" className="w-3.5 h-3.5 text-[#fbbf24]" />;
      case "Database":
        return <Icon icon="solar:database-bold-duotone" className="w-3.5 h-3.5 text-[#38bdf8]" />;
      case "Service":
        return isHealthy ? (
          <Icon icon="solar:check-circle-bold-duotone" className="w-3.5 h-3.5 text-[#10b981]" />
        ) : (
          <Icon icon="solar:server-bold-duotone" className="w-3.5 h-3.5 text-slate-300" />
        );
      case "Infrastructure":
        return <Icon icon="solar:cpu-bold-duotone" className="w-3.5 h-3.5 text-slate-300" />;
      default:
        return <Icon icon="solar:danger-triangle-bold-duotone" className="w-3.5 h-3.5 text-[#f43f5e]" />;
    }
  };

  return (
    <div
      className={`relative w-72 bg-[#161f30]/95 backdrop-blur-sm rounded border ${getStatusBorder()} transition-all duration-150 p-3 text-xs select-none shadow-lg hover:border-[#38bdf8]/70`}
    >
      {/* BorderBeam for active Root Cause node */}
      {isRootCause && (
        <BorderBeam size={70} duration={6} colorFrom="#f43f5e" colorTo="#38bdf8" borderWidth={1.5} />
      )}

      <Handle
        type="target"
        position={Position.Left}
        className={`!w-2 !h-2 ${isRootCause ? "!bg-[#f43f5e]" : "!bg-[#38bdf8]"} !border !border-[#0b0f17] !rounded-full`}
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {getIcon()}
          <span className="font-mono text-[10px] font-semibold text-slate-200 uppercase tracking-wider">
            {data.kind}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${getStatusBadge()} flex items-center gap-1`}>
            {isRootCause && <span className="w-1.5 h-1.5 rounded-full bg-[#f43f5e] animate-pulse" />}
            {data.status.replace("_", " ").toUpperCase()}
          </span>
          <span className="font-mono text-[10px] text-slate-400">{data.timestamp}</span>
        </div>
      </div>

      {/* Node Main Title */}
      <div className="font-sans font-medium text-white text-[13px] tracking-tight mb-1 truncate">
        {data.label}
      </div>

      {/* Secondary Symptom/Metric Subtext */}
      <div className="font-mono text-[11px] text-slate-300 leading-snug line-clamp-2">
        {data.subtext}
      </div>

      {/* Author Provenance Badge (Git nodes) */}
      {data.author && (
        <div className="mt-2 pt-2 border-t border-[#293548] flex items-center justify-between text-[10px] font-mono text-slate-400">
          <span className="flex items-center gap-1">
            <Icon icon="solar:user-bold-duotone" className="w-3 h-3 text-[#38bdf8]" />
            <span>{data.author}</span>
          </span>
          <span className="text-[#38bdf8] font-semibold">PR #1482</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className={`!w-2 !h-2 ${isRootCause ? "!bg-[#f43f5e]" : "!bg-[#38bdf8]"} !border !border-[#0b0f17] !rounded-full`}
      />
    </div>
  );
}
