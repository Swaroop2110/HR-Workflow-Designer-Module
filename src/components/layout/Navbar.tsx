import { useRef, useState } from "react";
import {
  Download,
  Eraser,
  PlayCircle,
  Redo2,
  Save,
  Undo2,
  Upload,
  Workflow,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWorkflowStore } from "@/store/workflowStore";
import { deserialize, downloadJson, serialize } from "@/utils/serializer";
import { toast } from "sonner";
import { SandboxModal } from "@/components/panels/SandboxModal";

export function Navbar() {
  const nodes = useWorkflowStore((s) => s.nodes);
  const edges = useWorkflowStore((s) => s.edges);
  const loadWorkflow = useWorkflowStore((s) => s.loadWorkflow);
  const clear = useWorkflowStore((s) => s.clear);
  const undo = useWorkflowStore((s) => s.undo);
  const redo = useWorkflowStore((s) => s.redo);
  const past = useWorkflowStore((s) => s.past.length);
  const future = useWorkflowStore((s) => s.future.length);

  const fileRef = useRef<HTMLInputElement>(null);
  const [sandboxOpen, setSandboxOpen] = useState(false);

  const handleSave = () => {
    const data = serialize(nodes, edges);
    localStorage.setItem("hr-workflow", JSON.stringify(data));
    toast.success("Workflow saved locally");
  };

  const handleExport = () => {
    downloadJson("workflow.json", serialize(nodes, edges));
    toast.success("Exported workflow.json");
  };

  const handleImport = () => fileRef.current?.click();

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const wf = deserialize(text);
      loadWorkflow(wf.nodes, wf.edges);
      toast.success("Workflow imported");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to import");
    } finally {
      e.target.value = "";
    }
  };

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card/60 px-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <Workflow className="h-4 w-4" />
        </div>
        <h1 className="text-sm font-semibold tracking-tight text-foreground">
          HR Workflow Designer
        </h1>
        <span className="ml-2 rounded-full border border-border bg-muted px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
          Prototype
        </span>
      </div>

      <div className="flex items-center gap-1.5">
        <Button
          variant="ghost"
          size="sm"
          disabled={past === 0}
          onClick={undo}
          title="Undo (Ctrl+Z)"
        >
          <Undo2 className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="sm"
          disabled={future === 0}
          onClick={redo}
          title="Redo (Ctrl+Shift+Z)"
        >
          <Redo2 className="h-4 w-4" />
        </Button>
        <div className="mx-1 h-5 w-px bg-border" />
        <Button variant="ghost" size="sm" onClick={handleSave}>
          <Save className="mr-1.5 h-4 w-4" />
          Save
        </Button>
        <Button variant="ghost" size="sm" onClick={handleExport}>
          <Download className="mr-1.5 h-4 w-4" />
          Export
        </Button>
        <Button variant="ghost" size="sm" onClick={handleImport}>
          <Upload className="mr-1.5 h-4 w-4" />
          Import
        </Button>
        <Button variant="ghost" size="sm" onClick={clear}>
          <Eraser className="mr-1.5 h-4 w-4" />
          Clear
        </Button>
        <Button size="sm" onClick={() => setSandboxOpen(true)}>
          <PlayCircle className="mr-1.5 h-4 w-4" />
          Run Simulation
        </Button>
        <input
          ref={fileRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={onFile}
        />
      </div>

      <SandboxModal open={sandboxOpen} onOpenChange={setSandboxOpen} />
    </header>
  );
}
