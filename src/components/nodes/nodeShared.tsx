import { Handle, Position } from "reactflow";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

interface NodeShellProps {
  title: string;
  subtitle?: string;
  icon: ReactNode;
  accentVar: string; // e.g. "var(--node-task)"
  selected?: boolean;
  showSource?: boolean;
  showTarget?: boolean;
  invalid?: boolean;
}

export function NodeShell({
  title,
  subtitle,
  icon,
  accentVar,
  selected,
  showSource = true,
  showTarget = true,
  invalid,
}: NodeShellProps) {
  return (
    <div
      className={cn(
        "relative min-w-[180px] rounded-xl border bg-card px-3 py-2.5 shadow-[var(--shadow-soft)] transition-all",
        selected ? "ring-2 ring-primary" : "border-border",
        invalid && "ring-2 ring-destructive",
      )}
      style={{ borderTopWidth: 3, borderTopColor: accentVar }}
    >
      {showTarget && <Handle type="target" position={Position.Top} />}
      <div className="flex items-center gap-2">
        <div
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md text-primary-foreground"
          style={{ backgroundColor: accentVar }}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-foreground">
            {title || "Untitled"}
          </div>
          {subtitle ? (
            <div className="truncate text-[11px] text-muted-foreground">
              {subtitle}
            </div>
          ) : null}
        </div>
      </div>
      {showSource && <Handle type="source" position={Position.Bottom} />}
    </div>
  );
}
