import { useEffect, useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { useWorkflowStore, genId } from "@/store/workflowStore";
import { getAutomations } from "@/services/api";
import type {
  ApproverRole,
  AutomationAction,
  KeyValue,
  WorkflowNodeData,
} from "@/types/workflowTypes";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

function KeyValueEditor({
  items,
  onChange,
  label = "Metadata",
}: {
  items: KeyValue[];
  onChange: (next: KeyValue[]) => void;
  label?: string;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="text-xs uppercase tracking-wide text-muted-foreground">
          {label}
        </Label>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() =>
            onChange([...items, { id: genId("kv"), key: "", value: "" }])
          }
        >
          <Plus className="mr-1 h-3.5 w-3.5" /> Add
        </Button>
      </div>
      {items.length === 0 ? (
        <p className="text-xs text-muted-foreground">No fields yet.</p>
      ) : (
        <div className="space-y-2">
          {items.map((it, idx) => (
            <div key={it.id} className="flex gap-2">
              <Input
                placeholder="key"
                value={it.key}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...it, key: e.target.value };
                  onChange(next);
                }}
              />
              <Input
                placeholder="value"
                value={it.value}
                onChange={(e) => {
                  const next = [...items];
                  next[idx] = { ...it, value: e.target.value };
                  onChange(next);
                }}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => onChange(items.filter((_, i) => i !== idx))}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function NodeConfigPanel() {
  const selectedId = useWorkflowStore((s) => s.selectedNodeId);
  const node = useWorkflowStore((s) =>
    s.nodes.find((n) => n.id === s.selectedNodeId),
  );
  const update = useWorkflowStore((s) => s.updateNodeData);
  const setSelected = useWorkflowStore((s) => s.setSelectedNodeId);
  const deleteSelected = useWorkflowStore((s) => s.deleteSelected);

  const [automations, setAutomations] = useState<AutomationAction[]>([]);

  useEffect(() => {
    let active = true;
    getAutomations().then((a) => {
      if (active) setAutomations(a);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!selectedId || !node) {
    return (
      <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card/40">
        <div className="border-b border-border px-4 py-3">
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Configuration
          </div>
        </div>
        <div className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
          Select a node on the canvas to edit its properties.
        </div>
      </aside>
    );
  }

  const data = node.data as WorkflowNodeData;

  return (
    <aside className="flex h-full w-80 shrink-0 flex-col border-l border-border bg-card/40">
      <div className="flex items-center justify-between border-b border-border px-4 py-3">
        <div>
          <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {data.kind} node
          </div>
          <div className="text-sm font-semibold text-foreground">
            {("title" in data && data.title) || data.label}
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setSelected(null)}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 space-y-5 overflow-y-auto p-4">
        {data.kind === "start" && (
          <>
            <div className="space-y-1.5">
              <Label>Start Title</Label>
              <Input
                value={data.title}
                onChange={(e) => update(node.id, { title: e.target.value })}
              />
            </div>
            <KeyValueEditor
              label="Metadata"
              items={data.metadata}
              onChange={(metadata) => update(node.id, { metadata })}
            />
          </>
        )}

        {data.kind === "task" && (
          <>
            <div className="space-y-1.5">
              <Label>
                Title <span className="text-destructive">*</span>
              </Label>
              <Input
                value={data.title}
                onChange={(e) => update(node.id, { title: e.target.value })}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label>Description</Label>
              <Textarea
                rows={3}
                value={data.description}
                onChange={(e) =>
                  update(node.id, { description: e.target.value })
                }
              />
            </div>
            <div className="space-y-1.5">
              <Label>Assignee</Label>
              <Input
                placeholder="e.g. jane.doe@acme.com"
                value={data.assignee}
                onChange={(e) => update(node.id, { assignee: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Due Date</Label>
              <Input
                type="date"
                value={data.dueDate}
                onChange={(e) => update(node.id, { dueDate: e.target.value })}
              />
            </div>
            <KeyValueEditor
              label="Custom Fields"
              items={data.customFields}
              onChange={(customFields) => update(node.id, { customFields })}
            />
          </>
        )}

        {data.kind === "approval" && (
          <>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={data.title}
                onChange={(e) => update(node.id, { title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Approver Role</Label>
              <Select
                value={data.approverRole}
                onValueChange={(v) =>
                  update(node.id, { approverRole: v as ApproverRole })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Manager">Manager</SelectItem>
                  <SelectItem value="HRBP">HRBP</SelectItem>
                  <SelectItem value="Director">Director</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label>Auto-Approve Threshold</Label>
              <Input
                type="number"
                value={data.autoApproveThreshold}
                onChange={(e) =>
                  update(node.id, {
                    autoApproveThreshold: Number(e.target.value),
                  })
                }
              />
            </div>
          </>
        )}

        {data.kind === "automated" && (
          <>
            <div className="space-y-1.5">
              <Label>Title</Label>
              <Input
                value={data.title}
                onChange={(e) => update(node.id, { title: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label>Action</Label>
              <Select
                value={data.actionId ?? ""}
                onValueChange={(v) =>
                  update(node.id, { actionId: v, actionParams: {} })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select an action" />
                </SelectTrigger>
                <SelectContent>
                  {automations.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {a.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {data.actionId && (
              <div className="space-y-2 rounded-lg border border-border bg-muted/30 p-3">
                <Label className="text-xs uppercase tracking-wide text-muted-foreground">
                  Action Parameters
                </Label>
                {automations
                  .find((a) => a.id === data.actionId)
                  ?.params.map((p) => (
                    <div key={p} className="space-y-1">
                      <Label className="text-xs">{p}</Label>
                      <Input
                        value={data.actionParams[p] ?? ""}
                        onChange={(e) =>
                          update(node.id, {
                            actionParams: {
                              ...data.actionParams,
                              [p]: e.target.value,
                            },
                          })
                        }
                      />
                    </div>
                  ))}
              </div>
            )}
          </>
        )}

        {data.kind === "end" && (
          <>
            <div className="space-y-1.5">
              <Label>End Message</Label>
              <Textarea
                rows={3}
                value={data.endMessage}
                onChange={(e) =>
                  update(node.id, { endMessage: e.target.value })
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-border p-3">
              <div>
                <Label>Summary Flag</Label>
                <p className="text-xs text-muted-foreground">
                  Generate execution summary
                </p>
              </div>
              <Switch
                checked={data.summaryFlag}
                onCheckedChange={(v) => update(node.id, { summaryFlag: v })}
              />
            </div>
          </>
        )}
      </div>

      <div className="border-t border-border p-3">
        <Button
          variant="destructive"
          className="w-full"
          onClick={deleteSelected}
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete node
        </Button>
      </div>
    </aside>
  );
}
