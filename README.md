# HR Workflow Designer

A production-ready React + TypeScript application for designing and simulating HR workflows. Built with modern frontend architecture principles, this tool empowers HR administrators to visually create complex workflows including onboarding, leave approvals, and document verification processes.

## Overview

The HR Workflow Designer provides a intuitive, drag-and-drop interface for creating sophisticated HR workflows without requiring code. It includes real-time validation, mock API integration, workflow simulation, and comprehensive node configuration capabilities.

### Key Capabilities
- **Visual Workflow Creation**: Drag-and-drop workflow builder with a professional canvas interface
- **5 Custom Node Types**: Start, Task, Approval, Automated Step, and End nodes
- **Dynamic Configuration**: Contextual forms for each node type with validation
- **Workflow Simulation**: Sandbox environment for testing workflows before deployment
- **State Management**: Undo/redo functionality with Zustand
- **Type Safety**: Full TypeScript support with strong typing throughout
- **Production Ready**: Clean architecture, performance optimized, thoroughly documented

## Features

### Core Functionality
- ✅ Drag-and-drop node placement from sidebar to canvas
- ✅ Node connection and edge management
- ✅ Node deletion and edge deletion
- ✅ Node selection, movement, zoom, and pan
- ✅ Background grid and MiniMap support
- ✅ Integrated controls panel for canvas manipulation
- ✅ Workflow validation with clear error messages

### Node Types
1. **Start Node**: Defines workflow entry point with metadata support
2. **Task Node**: Human task with assignee, due date, and custom fields
3. **Approval Node**: Role-based approvals with configurable thresholds
4. **Automated Step Node**: Integration with mock automation services
5. **End Node**: Workflow completion with optional summary reporting

### Advanced Features
- **Workflow Validation**: Prevents invalid configurations (single start node, required end node)
- **JSON Import/Export**: Serialize and deserialize workflows for persistence
- **Undo/Redo**: Full history management for user actions
- **Performance Optimization**: React.memo, useMemo, and useCallback implementations
- **Keyboard Shortcuts**: Delete key for node/edge removal
- **Visual Feedback**: Real-time validation warnings and error indicators

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend Framework** | React 19.2 |
| **Language** | TypeScript 5.8 |
| **State Management** | Zustand 5.0 |
| **Flow Visualization** | React Flow 11.11 |
| **Styling** | Tailwind CSS 4.2 |
| **UI Components** | Radix UI |
| **Form Management** | React Hook Form |
| **Router** | TanStack React Router |
| **Build Tool** | Vite 7.3 |
| **Code Quality** | ESLint + Prettier |

## Folder Structure

```
src/
├── components/
│   ├── canvas/                 # Workflow canvas and visualization
│   │   └── WorkflowCanvas.tsx  # Main React Flow canvas component
│   ├── sidebar/                # Node palette and workflow actions
│   │   ├── NodeSidebar.tsx     # Sidebar container
│   │   └── NodeItem.tsx        # Draggable node items
│   ├── nodes/                  # Custom node implementations
│   │   ├── StartNode.tsx       # Workflow entry point
│   │   ├── TaskNode.tsx        # Human task node
│   │   ├── ApprovalNode.tsx    # Approval decision node
│   │   ├── AutomatedStepNode.tsx  # Automation integration
│   │   └── EndNode.tsx         # Workflow completion
│   ├── panels/                 # Configuration and simulation
│   │   ├── NodeConfigPanel.tsx # Dynamic node form panel
│   │   └── SandboxModal.tsx    # Workflow simulation modal
│   └── layout/
│       └── Navbar.tsx          # Application header and navigation
├── hooks/                      # Custom React hooks
│   ├── useWorkflow.ts          # Workflow state and actions
│   └── useNodeSelection.ts     # Node selection state
├── services/
│   └── api.ts                  # Mock API layer with async functions
├── store/
│   └── workflowStore.ts        # Zustand workflow state management
├── types/
│   └── workflowTypes.ts        # TypeScript type definitions
├── utils/
│   ├── validation.ts           # Workflow validation logic
│   └── serializer.ts           # JSON serialization utilities
└── pages/
    └── WorkflowEditor.tsx      # Main editor page

```

## Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn package manager

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/Swaroop2110/flowforge-studio-98.git
   cd flowforge-studio-98
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Build for production**
   ```bash
   npm run build
   ```

5. **Preview production build**
   ```bash
   npm run preview
   ```

### Development Tools

```bash
# Code formatting
npm run format

# Linting
npm run lint

# Development build with source maps
npm run build:dev
```

## API Integration

### Mock API Layer (`src/services/api.ts`)

The application includes a mock API layer for development and testing:

#### `getAutomations()`
Retrieves available automation actions for the Automated Step node.

**Response:**
```json
[
  {
    "id": "send_email",
    "label": "Send Email",
    "params": ["to", "subject"]
  },
  {
    "id": "generate_doc",
    "label": "Generate Document",
    "params": ["template", "recipient"]
  }
]
```

#### `simulateWorkflow(workflow)`
Simulates workflow execution and returns step-by-step logs.

**Response:**
```json
[
  "Start workflow",
  "Task assigned to user",
  "Approval granted by manager",
  "Automation executed successfully",
  "Workflow completed"
]
```

**Note:** Both functions include simulated latency (1-2 seconds) to mimic real API behavior.

## State Management with Zustand

The workflow store manages:
- `nodes`: Array of workflow nodes
- `edges`: Array of node connections
- `selectedNode`: Currently selected node
- `workflowData`: Metadata and configuration
- `simulationLogs`: Execution logs from simulations

**Available Actions:**
```typescript
undo()          // Undo last action
redo()          // Redo last undone action
addNode(node)   // Add new node to canvas
deleteNode(id)  // Remove node by ID
updateNode(id, data)  // Update node properties
```

## Workflow Validation

The validation system ensures workflow integrity:

### `validateWorkflow()`
Performs complete workflow validation:
- Confirms exactly one Start node exists
- Ensures End node is present
- Detects cycle formation
- Validates node connections

### `validateStartNode()`
Checks Start node compliance:
- Ensures required title is present
- Validates metadata format

### `validateEndNode()`
Checks End node compliance:
- Verifies message content
- Validates configuration

### `detectCycles()`
Prevents circular dependencies in workflow graphs.

## Serialization & Persistence

### Export Workflow
```typescript
const json = serializeWorkflow(nodes, edges, metadata);
// Returns JSON string suitable for storage or transmission
```

### Import Workflow
```typescript
const { nodes, edges, metadata } = deserializeWorkflow(jsonString);
// Restores workflow from exported JSON
```

## Design Decisions

### State Management: Zustand
- **Why**: Lightweight, intuitive API without boilerplate
- **Benefit**: Faster development, easier debugging, minimal performance overhead
- **Undo/Redo**: Implemented via middleware for automatic history tracking

### Component Architecture
- **Modular Design**: Each component has a single responsibility
- **Custom Hooks**: Extracted logic for reusability (useWorkflow, useNodeSelection)
- **React.memo**: Prevents unnecessary re-renders of node components
- **Controlled Forms**: All node configuration inputs use React Hook Form for consistency

### Node Implementation Pattern
Each node type follows a consistent pattern:
1. TypeScript interface defining node-specific data
2. React component with memo optimization
3. Configuration form with validation
4. Integration with workflow store

### Canvas Architecture
- **React Flow Integration**: Leverages battle-tested flow visualization library
- **Grid Background**: Improves visual alignment and UX
- **MiniMap & Controls**: Enhances navigation for complex workflows
- **Real-time Validation**: Inline error feedback prevents invalid states

### Performance Optimization
- **useMemo**: Memoizes expensive calculations (validation, serialization)
- **useCallback**: Prevents handler function recreation on every render
- **React.memo**: Prevents node re-renders when external state unchanged

## Type Safety

Strong TypeScript types ensure compile-time safety:

```typescript
// Core workflow types
interface WorkflowNode {
  id: string;
  type: NodeType;
  position: { x: number; y: number };
  data: NodeData;
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface AutomationAction {
  id: string;
  label: string;
  params: string[];
}
```

## Code Quality

### Practices Implemented
- ✅ No console.log statements in production code
- ✅ Removed all Lovable branding and AI-generated comments
- ✅ Meaningful variable and function names
- ✅ Proper error handling and validation
- ✅ Documentation comments for complex logic
- ✅ Unused imports and files removed

### Linting & Formatting
- **ESLint**: Enforces code quality standards
- **Prettier**: Consistent code formatting
- Run `npm run format` before committing

## Browser Support

- Chrome/Chromium (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Future Enhancements

### Planned Features
1. **Auto-Layout**: Intelligent node positioning using force-directed algorithms
2. **Backend Integration**: Replace mock API with real REST/GraphQL endpoints
3. **Role-Based Access**: Implement permission system for workflow creation/execution
4. **Workflow Templates**: Pre-built templates for common HR scenarios
5. **Advanced Analytics**: Dashboard for workflow performance metrics
6. **Notifications**: Real-time alerts for workflow state changes
7. **Audit Trail**: Complete history of all workflow modifications
8. **Mobile Support**: Responsive design for tablet/mobile viewing

### Technical Debt Roadmap
- Implement end-to-end tests with Playwright
- Add visual regression testing
- Performance profiling and optimization
- Database schema design for persistence layer
- CI/CD pipeline setup

## Contributing

Contributions are welcome! Please follow these guidelines:

1. Create a feature branch (`git checkout -b feature/improvement`)
2. Commit your changes (`git commit -m 'Add improvement'`)
3. Push to the branch (`git push origin feature/improvement`)
4. Open a Pull Request

## Development Workflow

### Before Pushing
```bash
npm run format  # Format code
npm run lint    # Check for issues
npm run build   # Verify build succeeds
```

### Commit Messages
Use descriptive commit messages:
- `feat: Add approval node type`
- `fix: Resolve validation error in task node`
- `refactor: Extract form logic to custom hook`
- `docs: Update README with setup instructions`

## Troubleshooting

### Common Issues

**Q: Nodes not appearing on canvas?**
- Verify React Flow is properly initialized
- Check browser console for errors
- Ensure nodes array is not empty in store

**Q: Workflow simulation shows no output?**
- Verify workflow is valid (has Start and End nodes)
- Check mock API response in network tab
- Ensure nodes are connected properly

**Q: TypeScript errors after changes?**
- Run `npm run build` to check compilation
- Verify type definitions in `workflowTypes.ts`
- Check for missing type annotations

## Support & Questions

For questions, issues, or suggestions:
- Open an issue on GitHub
- Review existing issues for similar questions
- Provide clear reproduction steps for bugs

## License

This project is proprietary and maintained by the development team.

---

**Last Updated**: 2026-04-20 12:55:30
**Maintainer**: Development Team
**Repository**: [Swaroop2110/flowforge-studio-98](https://github.com/Swaroop2110/flowforge-studio-98)