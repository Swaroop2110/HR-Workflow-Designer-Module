import type { ReactNode } from "react";
import type { NodeKind } from "@/types/workflowTypes";

interface Props {
  kind: NodeKind;
  label: string;
  description: string;
  icon: ReactNode;
  accentVar: string;
}

export function NodeItem({ kind, label, description, icon, accentVar }: Props) {
  const onDragStart = (e: React.DragEvent) => {
    e.dataTransfer.setData("application/reactflow", kind);
    e.dataTransfer.effectAllowed = "move";
  };

  return (
    <div
      draggable
      onDragStart={onDragStart}
      className="group flex cursor-grab items-center gap-3 rounded-lg border border-border bg-card p-3 transition-all hover:border-primary/50 hover:bg-accent active:cursor-grabbing"
    >
      <div
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-primary-foreground"
        style={{ backgroundColor: accentVar }}
      >
        {icon}
      </div>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{label}</div>
        <div className="truncate text-xs text-muted-foreground">
          {description}
        </div>
      </div>
    </div>
  );
}
