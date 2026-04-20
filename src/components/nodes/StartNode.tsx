import { memo } from "react";
import { Play } from "lucide-react";
import type { NodeProps } from "reactflow";
import { NodeShell } from "./nodeShared";
import type { StartNodeData } from "@/types/workflowTypes";

function StartNode({ data, selected }: NodeProps<StartNodeData>) {
  return (
    <NodeShell
      title={data.title}
      subtitle="Start"
      icon={<Play className="h-3.5 w-3.5" />}
      accentVar="var(--node-start)"
      selected={selected}
      showTarget={false}
    />
  );
}
export default memo(StartNode);
