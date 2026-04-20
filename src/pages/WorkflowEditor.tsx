import { Navbar } from "@/components/layout/Navbar";
import { NodeSidebar } from "@/components/sidebar/NodeSidebar";
import { WorkflowCanvas } from "@/components/canvas/WorkflowCanvas";
import { NodeConfigPanel } from "@/components/panels/NodeConfigPanel";
import { Toaster } from "@/components/ui/sonner";

export function WorkflowEditor() {
  return (
    <div className="flex h-screen w-screen flex-col overflow-hidden bg-background text-foreground">
      <Navbar />
      <div className="flex min-h-0 flex-1">
        <NodeSidebar />
        <main className="relative min-w-0 flex-1">
          <WorkflowCanvas />
        </main>
        <NodeConfigPanel />
      </div>
      <Toaster theme="dark" position="bottom-right" />
    </div>
  );
}
