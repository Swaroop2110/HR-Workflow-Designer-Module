import { memo } from "react";
import { Zap } from "lucide-react";
import type { NodeProps } from "reactflow";
import { NodeShell } from "./nodeShared";
import type { AutomatedNodeData } from "@/types/workflowTypes";

function AutomatedStepNode({ data, selected }: NodeProps<AutomatedNodeData>) {
  return (
    <NodeShell
      title={data.title}
      subtitle={data.actionId ? `Action: ${data.actionId}` : "Pick an action"}
      icon={<Zap className="h-3.5 w-3.5" />}
      accentVar="var(--node-auto)"
      selected={selected}
    />
  );
}
export default memo(AutomatedStepNode);
