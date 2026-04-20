import type {
  ValidationIssue,
  WorkflowEdge,
  WorkflowNode,
} from "@/types/workflowTypes";

export function validateWorkflow(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): ValidationIssue[] {
  const issues: ValidationIssue[] = [];
  const startNodes = nodes.filter((n) => n.data.kind === "start");
  const endNodes = nodes.filter((n) => n.data.kind === "end");

  if (startNodes.length === 0) {
    issues.push({ level: "error", message: "Workflow must have a Start node." });
  }
  if (startNodes.length > 1) {
    issues.push({
      level: "error",
      message: "Only one Start node is allowed.",
    });
  }
  if (endNodes.length === 0) {
    issues.push({ level: "error", message: "Workflow must have an End node." });
  }

  if (nodes.length > 1) {
    const connected = new Set<string>();
    edges.forEach((e) => {
      connected.add(e.source);
      connected.add(e.target);
    });
    nodes.forEach((n) => {
      if (!connected.has(n.id)) {
        issues.push({
          level: "warning",
          nodeId: n.id,
          message: `Node "${n.data.label}" is not connected.`,
        });
      }
    });
  }

  // Cycle detection via DFS
  const adj = new Map<string, string[]>();
  edges.forEach((e) => {
    if (!adj.has(e.source)) adj.set(e.source, []);
    adj.get(e.source)!.push(e.target);
  });
  const visiting = new Set<string>();
  const visited = new Set<string>();
  let hasCycle = false;
  const dfs = (id: string) => {
    if (hasCycle) return;
    visiting.add(id);
    for (const next of adj.get(id) ?? []) {
      if (visiting.has(next)) {
        hasCycle = true;
        return;
      }
      if (!visited.has(next)) dfs(next);
    }
    visiting.delete(id);
    visited.add(id);
  };
  nodes.forEach((n) => !visited.has(n.id) && dfs(n.id));
  if (hasCycle) {
    issues.push({
      level: "error",
      message: "Workflow contains a cycle. Remove circular connections.",
    });
  }

  return issues;
}
