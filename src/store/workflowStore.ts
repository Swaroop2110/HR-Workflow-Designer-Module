import { create } from "zustand";
import {
  addEdge,
  applyEdgeChanges,
  applyNodeChanges,
  type Connection,
  type EdgeChange,
  type NodeChange,
} from "reactflow";
import type {
  NodeKind,
  SimulationLog,
  WorkflowEdge,
  WorkflowNode,
  WorkflowNodeData,
} from "@/types/workflowTypes";

let idCounter = 1;
export const genId = (prefix = "n") => `${prefix}_${Date.now()}_${idCounter++}`;

export function defaultDataFor(kind: NodeKind): WorkflowNodeData {
  switch (kind) {
    case "start":
      return { kind, label: "Start", title: "Workflow Start", metadata: [] };
    case "task":
      return {
        kind,
        label: "Task",
        title: "New Task",
        description: "",
        assignee: "",
        dueDate: "",
        customFields: [],
      };
    case "approval":
      return {
        kind,
        label: "Approval",
        title: "Approval Step",
        approverRole: "Manager",
        autoApproveThreshold: 0,
      };
    case "automated":
      return {
        kind,
        label: "Automation",
        title: "Automated Step",
        actionId: null,
        actionParams: {},
      };
    case "end":
      return {
        kind,
        label: "End",
        endMessage: "Workflow complete",
        summaryFlag: true,
      };
  }
}

interface HistorySnapshot {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
}

interface WorkflowState {
  nodes: WorkflowNode[];
  edges: WorkflowEdge[];
  selectedNodeId: string | null;
  simulationLogs: SimulationLog[];
  past: HistorySnapshot[];
  future: HistorySnapshot[];

  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  onConnect: (conn: Connection) => void;
  addNode: (kind: NodeKind, position: { x: number; y: number }) => void;
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (id: string, patch: Partial<WorkflowNodeData>) => void;
  deleteSelected: () => void;
  clear: () => void;
  loadWorkflow: (nodes: WorkflowNode[], edges: WorkflowEdge[]) => void;
  setSimulationLogs: (logs: SimulationLog[]) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

const MAX_HISTORY = 50;

export const useWorkflowStore = create<WorkflowState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,
  simulationLogs: [],
  past: [],
  future: [],

  pushHistory: () => {
    const { nodes, edges, past } = get();
    const snap: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    const next = [...past, snap].slice(-MAX_HISTORY);
    set({ past: next, future: [] });
  },

  onNodesChange: (changes) => {
    set({ nodes: applyNodeChanges(changes, get().nodes) as WorkflowNode[] });
  },
  onEdgesChange: (changes) => {
    set({ edges: applyEdgeChanges(changes, get().edges) });
  },
  onConnect: (conn) => {
    if (!conn.source || !conn.target) return;
    if (conn.source === conn.target) return;
    get().pushHistory();
    set({
      edges: addEdge(
        { ...conn, animated: true, type: "smoothstep" },
        get().edges,
      ),
    });
  },
  addNode: (kind, position) => {
    get().pushHistory();
    const id = genId(kind);
    const data = defaultDataFor(kind);
    const node: WorkflowNode = {
      id,
      type: kind,
      position,
      data,
    };
    set({ nodes: [...get().nodes, node], selectedNodeId: id });
  },
  setSelectedNodeId: (id) => set({ selectedNodeId: id }),
  updateNodeData: (id, patch) => {
    set({
      nodes: get().nodes.map((n) =>
        n.id === id
          ? { ...n, data: { ...n.data, ...patch } as WorkflowNodeData }
          : n,
      ),
    });
  },
  deleteSelected: () => {
    const { selectedNodeId, nodes, edges } = get();
    if (!selectedNodeId) return;
    get().pushHistory();
    set({
      nodes: nodes.filter((n) => n.id !== selectedNodeId),
      edges: edges.filter(
        (e) => e.source !== selectedNodeId && e.target !== selectedNodeId,
      ),
      selectedNodeId: null,
    });
  },
  clear: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null, simulationLogs: [] });
  },
  loadWorkflow: (nodes, edges) => {
    get().pushHistory();
    set({ nodes, edges, selectedNodeId: null });
  },
  setSimulationLogs: (logs) => set({ simulationLogs: logs }),

  undo: () => {
    const { past, nodes, edges, future } = get();
    if (past.length === 0) return;
    const prev = past[past.length - 1];
    const current: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      past: past.slice(0, -1),
      future: [current, ...future].slice(0, MAX_HISTORY),
      nodes: prev.nodes,
      edges: prev.edges,
      selectedNodeId: null,
    });
  },
  redo: () => {
    const { future, nodes, edges, past } = get();
    if (future.length === 0) return;
    const [next, ...rest] = future;
    const current: HistorySnapshot = {
      nodes: JSON.parse(JSON.stringify(nodes)),
      edges: JSON.parse(JSON.stringify(edges)),
    };
    set({
      past: [...past, current].slice(-MAX_HISTORY),
      future: rest,
      nodes: next.nodes,
      edges: next.edges,
      selectedNodeId: null,
    });
  },
}));
