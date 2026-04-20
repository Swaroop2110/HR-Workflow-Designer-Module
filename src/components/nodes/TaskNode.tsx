import { memo } from "react";
import { ListChecks } from "lucide-react";
import type { NodeProps } from "reactflow";
import { NodeShell } from "./nodeShared";
import type { TaskNodeData } from "@/types/workflowTypes";

function TaskNode({ data, selected }: NodeProps<TaskNodeData>) {
  return (
    <NodeShell
      title={data.title}
      subtitle={data.assignee ? `Assignee: ${data.assignee}` : "Task"}
      icon={<ListChecks className="h-3.5 w-3.5" />}
      accentVar="var(--node-task)"
      selected={selected}
    />
  );
}
export default memo(TaskNode);
