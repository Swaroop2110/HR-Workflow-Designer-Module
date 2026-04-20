import type {
  SerializedWorkflow,
  WorkflowEdge,
  WorkflowNode,
} from "@/types/workflowTypes";

export function serialize(
  nodes: WorkflowNode[],
  edges: WorkflowEdge[],
): SerializedWorkflow {
  return {
    version: 1,
    nodes,
    edges,
    exportedAt: new Date().toISOString(),
  };
}

export function deserialize(json: string): SerializedWorkflow {
  const parsed = JSON.parse(json) as SerializedWorkflow;
  if (!parsed.nodes || !parsed.edges) {
    throw new Error("Invalid workflow JSON: missing nodes or edges.");
  }
  return parsed;
}

export function downloadJson(filename: string, data: unknown) {
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
