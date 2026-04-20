import { memo } from "react";
import { ShieldCheck } from "lucide-react";
import type { NodeProps } from "reactflow";
import { NodeShell } from "./nodeShared";
import type { ApprovalNodeData } from "@/types/workflowTypes";

function ApprovalNode({ data, selected }: NodeProps<ApprovalNodeData>) {
  return (
    <NodeShell
      title={data.title}
      subtitle={`Approver: ${data.approverRole}`}
      icon={<ShieldCheck className="h-3.5 w-3.5" />}
      accentVar="var(--node-approval)"
      selected={selected}
    />
  );
}
export default memo(ApprovalNode);
