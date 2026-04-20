import { Flag, ListChecks, Play, ShieldCheck, Zap } from "lucide-react";
import { NodeItem } from "./NodeItem";

export function NodeSidebar() {
  return (
    <aside className="flex h-full w-64 shrink-0 flex-col border-r border-border bg-card/40">
      <div className="border-b border-border px-4 py-3">
        <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Node Palette
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          Drag a node onto the canvas
        </p>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto p-3">
        <NodeItem
          kind="start"
          label="Start"
          description="Workflow entry point"
          icon={<Play className="h-4 w-4" />}
          accentVar="var(--node-start)"
        />
        <NodeItem
          kind="task"
          label="Task"
          description="Human task / form"
          icon={<ListChecks className="h-4 w-4" />}
          accentVar="var(--node-task)"
        />
        <NodeItem
          kind="approval"
          label="Approval"
          description="Manager / HR approval"
          icon={<ShieldCheck className="h-4 w-4" />}
          accentVar="var(--node-approval)"
        />
        <NodeItem
          kind="automated"
          label="Automated"
          description="System action (email, doc...)"
          icon={<Zap className="h-4 w-4" />}
          accentVar="var(--node-auto)"
        />
        <NodeItem
          kind="end"
          label="End"
          description="Workflow completion"
          icon={<Flag className="h-4 w-4" />}
          accentVar="var(--node-end)"
        />
      </div>
      <div className="mt-auto border-t border-border p-3 text-[11px] text-muted-foreground">
        <div>Tips</div>
        <ul className="mt-1 space-y-0.5">
          <li>• Drag handles to connect</li>
          <li>• Press Delete to remove</li>
          <li>• Ctrl/Cmd+Z to undo</li>
        </ul>
      </div>
    </aside>
  );
}
