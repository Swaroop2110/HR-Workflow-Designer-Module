import { memo } from "react";
import { Flag } from "lucide-react";
import type { NodeProps } from "reactflow";
import { NodeShell } from "./nodeShared";
import type { EndNodeData } from "@/types/workflowTypes";

function EndNode({ data, selected }: NodeProps<EndNodeData>) {
  return (
    <NodeShell
      title="End"
      subtitle={data.endMessage || "Workflow end"}
      icon={<Flag className="h-3.5 w-3.5" />}
      accentVar="var(--node-end)"
      selected={selected}
      showSource={false}
    />
  );
}
export default memo(EndNode);
