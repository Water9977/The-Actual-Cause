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
    if (selected) return "ring-1 ring-zinc-300 border-zinc-300";
    if (isRootCause) return "border-red-600/80";
    if (isDegraded) return "border-amber-600/70";
    if (isHealthy) return "border-emerald-700/60";
    return "border-zinc-800/80";
  };

  const getStatusBadge = () => {
    if (isRootCause) return "bg-red-950/30 text-red-400 border-red-800/50";
    if (isDegraded) return "bg-amber-950/30 text-amber-400 border-amber-800/50";
    if (isHealthy) return "bg-emerald-950/30 text-emerald-400 border-emerald-800/50";
    return "bg-zinc-900 text-zinc-400 border-zinc-800";
  };

  const getIcon = () => {
    switch (data.kind) {
      case "Commit":
        return <Icon icon="ph:git-commit-light" className="w-3.5 h-3.5 text-red-400" />;
      case "ConfigDrift":
        return <Icon icon="ph:faders-horizontal-light" className="w-3.5 h-3.5 text-red-400" />;
      case "Database":
        return <Icon icon="tabler:database" className="w-3.5 h-3.5 text-amber-400" />;
      case "Service":
        return isHealthy ? (
          <Icon icon="ph:check-circle-light" className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Icon icon="tabler:server-2" className="w-3.5 h-3.5 text-zinc-300" />
        );
      case "Infrastructure":
        return <Icon icon="ph:cpu-light" className="w-3.5 h-3.5 text-zinc-300" />;
      default:
        return <Icon icon="ph:warning-circle-light" className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div
      className={`relative w-72 bg-zinc-950/95 backdrop-blur-sm rounded border ${getStatusBorder()} transition-all duration-150 p-3 text-xs select-none shadow-sm hover:border-zinc-600`}
    >
      {/* BorderBeam for active Root Cause node */}
      {isRootCause && (
        <BorderBeam size={70} duration={6} colorFrom="#ef4444" colorTo="#f59e0b" borderWidth={1.5} />
      )}

      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-zinc-700 !border !border-zinc-950 !rounded-full"
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {getIcon()}
          <span className="font-mono text-[10px] font-semibold text-zinc-300 uppercase tracking-wider">
            {data.kind}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono border ${getStatusBadge()} flex items-center gap-1`}>
            {isRootCause && <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />}
            {data.status.replace("_", " ").toUpperCase()}
          </span>
          <span className="font-mono text-[10px] text-zinc-500">{data.timestamp}</span>
        </div>
      </div>

      {/* Node Main Title */}
      <div className="font-sans font-medium text-zinc-100 text-[13px] tracking-tight mb-1 truncate">
        {data.label}
      </div>

      {/* Secondary Symptom/Metric Subtext */}
      <div className="font-mono text-[11px] text-zinc-400 leading-snug line-clamp-2">
        {data.subtext}
      </div>

      {/* Optional Author or System ID */}
      {data.author && (
        <div className="mt-2.5 pt-2 border-t border-zinc-900/80 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span className="text-zinc-600">SME:</span>
          <span className="text-zinc-300 truncate max-w-[170px] flex items-center gap-1">
            <Icon icon="ph:user-light" className="w-2.5 h-2.5 text-zinc-500" />
            {data.author}
          </span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-zinc-700 !border !border-zinc-950 !rounded-full"
      />
    </div>
  );
}
