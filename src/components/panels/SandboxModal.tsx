import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useWorkflowStore } from "@/store/workflowStore";
import { simulateWorkflow } from "@/services/api";
import { serialize } from "@/utils/serializer";
import { validateWorkflow } from "@/utils/validation";
import { CheckCircle2, Loader2, AlertCircle, Info } from "lucide-react";
import type { SimulationLog, ValidationIssue } from "@/types/workflowTypes";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
}

export function SandboxModal({ open, onOpenChange }: Props) {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const [logs, setLogs] = useState<SimulationLog[]>([]);
  const [issues, setIssues] = useState<ValidationIssue[]>([]);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!open) return;
    setRunning(true);
    setLogs([]);
    const v = validateWorkflow(nodes, edges);
    setIssues(v);
    simulateWorkflow(serialize(nodes, edges))
      .then((res) => setLogs(res.logs))
      .finally(() => setRunning(false));
  }, [open, nodes, edges]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Workflow Simulation</DialogTitle>
        </DialogHeader>

        {issues.length > 0 && (
          <div className="space-y-1.5 rounded-lg border border-border bg-muted/40 p-3">
            <div className="text-xs font-semibold uppercase text-muted-foreground">
              Validation
            </div>
            {issues.map((i, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-2 text-sm ${
                  i.level === "error"
                    ? "text-destructive"
                    : "text-amber-400"
                }`}
              >
                <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
                <span>{i.message}</span>
              </div>
            ))}
          </div>
        )}

        <div className="max-h-[420px] overflow-y-auto rounded-lg border border-border bg-background/60 p-3">
          {running ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Loader2 className="h-4 w-4 animate-spin" />
              Running simulation…
            </div>
          ) : logs.length === 0 ? (
            <div className="text-sm text-muted-foreground">
              No execution logs.
            </div>
          ) : (
            <ol className="relative space-y-3 border-l border-border pl-5">
              {logs.map((l) => (
                <li key={l.step} className="relative">
                  <span
                    className={`absolute -left-[26px] top-0.5 flex h-4 w-4 items-center justify-center rounded-full ${
                      l.status === "success"
                        ? "bg-emerald-500/20 text-emerald-400"
                        : l.status === "error"
                          ? "bg-destructive/20 text-destructive"
                          : "bg-primary/20 text-primary"
                    }`}
                  >
                    {l.status === "success" ? (
                      <CheckCircle2 className="h-3 w-3" />
                    ) : l.status === "error" ? (
                      <AlertCircle className="h-3 w-3" />
                    ) : (
                      <Info className="h-3 w-3" />
                    )}
                  </span>
                  <div className="text-sm text-foreground">{l.message}</div>
                  <div className="text-[11px] text-muted-foreground">
                    Step {l.step} · {new Date(l.timestamp).toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ol>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
