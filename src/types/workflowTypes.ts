import type { Node, Edge } from "reactflow";

export type NodeKind = "start" | "task" | "approval" | "automated" | "end";

export interface KeyValue {
  id: string;
  key: string;
  value: string;
}

export interface StartNodeData {
  kind: "start";
  label: string;
  title: string;
  metadata: KeyValue[];
}

export interface TaskNodeData {
  kind: "task";
  label: string;
  title: string;
  description: string;
  assignee: string;
  dueDate: string;
  customFields: KeyValue[];
}

export type ApproverRole = "Manager" | "HRBP" | "Director";

export interface ApprovalNodeData {
  kind: "approval";
  label: string;
  title: string;
  approverRole: ApproverRole;
  autoApproveThreshold: number;
}

export interface AutomatedNodeData {
  kind: "automated";
  label: string;
  title: string;
  actionId: string | null;
  actionParams: Record<string, string>;
}

export interface EndNodeData {
  kind: "end";
  label: string;
  endMessage: string;
  summaryFlag: boolean;
}

export type WorkflowNodeData =
  | StartNodeData
  | TaskNodeData
  | ApprovalNodeData
  | AutomatedNodeData
  | EndNodeData;

export type WorkflowNode = Node<WorkflowNodeData>;
export type WorkflowEdge = Edge;

export interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}

export interface SimulationLog {
  step: number;
  message: string;
  status: "info" | "success" | "error";
  timestamp: string;
}

export interface ValidationIssue {
  level: "error" | "warning";
  message: string;
  nodeId?: string;
}

export interface SerializedWorkflow {
  version: 1;
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  exportedAt: string;
}
