import { createFileRoute } from "@tanstack/react-router";
import { WorkflowEditor } from "@/pages/WorkflowEditor";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HR Workflow Designer" },
      {
        name: "description",
        content:
          "Visually design HR workflows — onboarding, leave approvals, and document verification — with a drag-and-drop canvas, configurable nodes, and built-in simulation.",
      },
    ],
  }),
  component: WorkflowEditor,
});
