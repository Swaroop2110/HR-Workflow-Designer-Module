import type {
  AutomationAction,
  SerializedWorkflow,
  SimulationLog,
} from "@/types/workflowTypes";
import { validateWorkflow } from "@/utils/validation";

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

const AUTOMATIONS: AutomationAction[] = [
  { id: "send_email", label: "Send Email", params: ["to", "subject"] },
  {
    id: "generate_doc",
    label: "Generate Document",
    params: ["template", "recipient"],
  },
  {
    id: "post_slack",
    label: "Post to Slack",
    params: ["channel", "message"],
  },
  {
    id: "create_ticket",
    label: "Create Jira Ticket",
    params: ["project", "summary", "priority"],
  },
];

export async function getAutomations(): Promise<AutomationAction[]> {
  await delay(250);
  return AUTOMATIONS;
}

export async function simulateWorkflow(
  workflow: SerializedWorkflow,
): Promise<{ logs: SimulationLog[]; ok: boolean }> {
  await delay(400);
  const issues = validateWorkflow(workflow.nodes, workflow.edges);
  const errors = issues.filter((i) => i.level === "error");

  if (errors.length > 0) {
    return {
      ok: false,
      logs: errors.map((e, i) => ({
        step: i + 1,
        message: `Validation error: ${e.message}`,
        status: "error" as const,
        timestamp: new Date().toISOString(),
      })),
    };
  }

  // Walk the graph from the start node
  const logs: SimulationLog[] = [];
  const startNode = workflow.nodes.find((n) => n.data.kind === "start");
  const adjacency = new Map<string, string[]>();
  workflow.edges.forEach((e) => {
    if (!adjacency.has(e.source)) adjacency.set(e.source, []);
    adjacency.get(e.source)!.push(e.target);
  });

  const visited = new Set<string>();
  const order: typeof workflow.nodes = [];
  const queue = startNode ? [startNode.id] : [];
  while (queue.length) {
    const id = queue.shift()!;
    if (visited.has(id)) continue;
    visited.add(id);
    const node = workflow.nodes.find((n) => n.id === id);
    if (!node) continue;
    order.push(node);
    (adjacency.get(id) ?? []).forEach((next) => queue.push(next));
  }

  let step = 1;
  for (const node of order) {
    await delay(60);
    const ts = new Date().toISOString();
    switch (node.data.kind) {
      case "start":
        logs.push({
          step: step++,
          message: `▶ Workflow started: "${node.data.title || "Untitled"}"`,
          status: "success",
          timestamp: ts,
        });
        break;
      case "task":
        logs.push({
          step: step++,
          message: `📋 Task assigned to ${node.data.assignee || "—"}: "${node.data.title || "Untitled"}"`,
          status: "info",
          timestamp: ts,
        });
        break;
      case "approval":
        logs.push({
          step: step++,
          message: `✅ Approval (${node.data.approverRole}) granted for "${node.data.title || "Untitled"}" — threshold ${node.data.autoApproveThreshold}`,
          status: "success",
          timestamp: ts,
        });
        break;
      case "automated": {
        const d = node.data;
        const action =
          d.kind === "automated"
            ? AUTOMATIONS.find((a) => a.id === d.actionId)
            : undefined;
        logs.push({
          step: step++,
          message: `⚙ Automation executed: ${action?.label ?? "unknown action"}`,
          status: action ? "success" : "error",
          timestamp: ts,
        });
        break;
      }
      case "end":
        logs.push({
          step: step++,
          message: `🏁 Workflow completed: ${node.data.endMessage || "Done"}`,
          status: "success",
          timestamp: ts,
        });
        break;
    }
  }

  return { ok: true, logs };
}
