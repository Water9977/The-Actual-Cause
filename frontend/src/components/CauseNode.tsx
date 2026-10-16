import React from "react";
import { Handle, Position } from "@xyflow/react";
import { GitCommit, AlertTriangle, Server, Database, CheckCircle2, ShieldAlert } from "lucide-react";

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
    if (selected) return "ring-2 ring-zinc-100 border-zinc-100";
    if (isRootCause) return "border-red-600/90 shadow-sm shadow-red-950/50";
    if (isDegraded) return "border-amber-500/80 shadow-sm shadow-amber-950/30";
    if (isHealthy) return "border-emerald-600/70";
    return "border-zinc-800";
  };

  const getStatusBadge = () => {
    if (isRootCause) return "bg-red-950/90 text-red-300 border-red-800/80";
    if (isDegraded) return "bg-amber-950/90 text-amber-300 border-amber-800/80";
    if (isHealthy) return "bg-emerald-950/80 text-emerald-300 border-emerald-800/80";
    return "bg-zinc-900 text-zinc-400 border-zinc-800";
  };

  const getIcon = () => {
    switch (data.kind) {
      case "Commit":
        return <GitCommit className="w-3.5 h-3.5 text-red-400" />;
      case "ConfigDrift":
        return <ShieldAlert className="w-3.5 h-3.5 text-red-400" />;
      case "Database":
        return <Database className="w-3.5 h-3.5 text-amber-400" />;
      case "Service":
        return isHealthy ? (
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
        ) : (
          <Server className="w-3.5 h-3.5 text-zinc-300" />
        );
      default:
        return <AlertTriangle className="w-3.5 h-3.5 text-zinc-400" />;
    }
  };

  return (
    <div
      className={`w-72 bg-zinc-950 rounded border ${getStatusBorder()} transition-all duration-150 p-3 text-xs select-none`}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-2 !h-2 !bg-zinc-600 !border-zinc-950"
      />

      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <div className="flex items-center gap-1.5">
          {getIcon()}
          <span className="font-mono text-[11px] font-semibold text-zinc-300 uppercase tracking-wider">
            {data.kind}
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono border ${getStatusBadge()}`}>
            {data.status.replace("_", " ")}
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
        <div className="mt-2 pt-2 border-t border-zinc-900 flex items-center justify-between text-[10px] text-zinc-500 font-mono">
          <span>Author:</span>
          <span className="text-zinc-300 truncate max-w-[170px]">{data.author}</span>
        </div>
      )}

      <Handle
        type="source"
        position={Position.Right}
        className="!w-2 !h-2 !bg-zinc-600 !border-zinc-950"
      />
    </div>
  );
}
