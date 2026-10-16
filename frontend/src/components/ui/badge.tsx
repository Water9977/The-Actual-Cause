import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "critical" | "degraded" | "healthy" | "cyan";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  const variants = {
    default: "border-transparent bg-zinc-100 text-zinc-900 shadow hover:bg-zinc-100/80",
    secondary: "border-zinc-800 bg-zinc-900/80 text-zinc-300 hover:bg-zinc-800",
    destructive: "border-red-900/50 bg-red-950/60 text-red-400 shadow hover:bg-red-950/80",
    outline: "border-zinc-800 text-zinc-400 hover:border-zinc-700",
    critical: "border-red-500/40 bg-red-500/10 text-red-400 font-mono text-[10px]",
    degraded: "border-amber-500/40 bg-amber-500/10 text-amber-400 font-mono text-[10px]",
    healthy: "border-emerald-500/40 bg-emerald-500/10 text-emerald-400 font-mono text-[10px]",
    cyan: "border-cyan-500/40 bg-cyan-500/10 text-cyan-400 font-mono text-[10px]",
  };

  return (
    <div
      className={cn(
        "inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-zinc-400 focus:ring-offset-2",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}

export { Badge };
