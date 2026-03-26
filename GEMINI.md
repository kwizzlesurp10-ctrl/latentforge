# GEMINI.md — Project Context: LatentForge

## Project Overview
**LatentForge** is a privacy-first, "local-first" creative workspace built on **GitHub Spark**. It's designed for capturing, organizing, and alchemizing ideas into structured artifacts using AI. The application follows a "cyberpunk neon-panda" aesthetic and emphasizes creative sovereignty through personal style adapters and offline-first capabilities.

### Core Features
- **Shadow Vault**: A quick-capture sidebar for text, code, images, and prompts with versioned snapshots.
- **Forge Canvas**: An infinite, hybrid workspace for connecting ideas as nodes (text, code, mindmaps).
- **AI Co-pilot**: A real-time preview panel that streams AI refinements, expansions, and transformations.
- **Style LoRA Trainer**: A system to train lightweight AI style adapters based on personal examples.
- **Agent Swarm**: Specialized AI agents (Researcher, Code Architect, Visualizer) for parallel exploration.
- **Timeline Rebellion**: A non-linear history browser for exploring and resurrecting idea branches.

## Technical Stack
- **Frontend**: React 19, TypeScript 5.7, Vite 7.x
- **Styling**: Tailwind CSS 4, CSS Custom Properties (OKLCH color space), Framer Motion 12
- **UI Components**: Shadcn UI v4 (Radix UI primitives), Phosphor Icons (duotone)
- **State Management**: GitHub Spark `useKV` (persistent), React `useState` (ephemeral)
- **AI Integration**: GitHub Spark LLM API (GPT-4o-mini)
- **Persistence**: Spark KV Store + IndexedDB (offline fallback)
- **Testing**: Vitest (Unit), Playwright (E2E), Percy (Visual Regression)

## Core Architecture
- **Entry Point**: `src/main.tsx` mounts the application and initializes the Spark runtime.
- **State Orchestration**: `src/App.tsx` acts as the single source of truth for persistent state (`vault-items`, `canvas-nodes`, `connections`) and manages global UI states and keyboard shortcuts.
- **Feature Modules**:
  - `src/components/vault/`: Shadow Vault logic and sidebar.
  - `src/components/canvas/`: Forge Canvas implementation with pan/zoom logic.
  - `src/components/AIPreviewPanel.tsx`: AI integration and streaming logic.
- **Type System**: `src/lib/types.ts` contains all shared interfaces (VaultItem, CanvasNode, Connection, Agent, etc.).
- **Theming**: `src/index.css` defines the OKLCH design tokens and global styles.

## Key Development Commands
```bash
# Development
npm run dev           # Start Vite dev server on :5173
npm run optimize      # Pre-bundle dependencies

# Testing
npm test              # Run unit tests (Vitest)
npm run test:run      # Single-pass unit tests
npm run test:e2e      # Run E2E tests (Playwright)
npm run test:visual   # Run visual regression tests (Percy)
npm run test:all      # Run all tests (Unit + E2E)

# Build
npm run build         # Type-check and build for production
npm run preview       # Preview production build locally

# Linting
npm run lint          # Run ESLint
```

## Development Conventions

### Styling & UI
- **Colors**: Use OKLCH color tokens from `index.css` (e.g., `text-primary`, `bg-background`).
- **Icons**: Use Phosphor Icons (`@phosphor-icons/react`) with `weight="duotone"`.
- **Glows**: Apply `.glow-hover`, `.glow-primary`, or `.pulse-glow` for the cyberpunk aesthetic.
- **Components**: Follow the Shadcn pattern. Components in `src/components/ui/` are base primitives; feature-specific components go in their respective folders.

### Coding Patterns
- **State**: Prefer `useKV` for data that should persist across sessions and `useState` for transient UI states (modals, active tabs).
- **Callbacks**: Wrap all mutation handlers passed to children in `useCallback` to optimize canvas performance.
- **IDs**: Use the established pattern: ``id: `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}` ``.
- **AI Prompts**: Use `spark.llmPrompt` tagged templates for all LLM interactions.

### Testing
- **Unit Tests**: Co-locate `*.test.tsx` files with their components. Use React Testing Library and Happy DOM.
- **E2E Tests**: Use Playwright for critical user flows in `e2e/`.
- **Visual Tests**: Percy snapshots are triggered on 4 viewports (375px, 768px, 1280px, 1920px).

## Project Structure Highlights
- `PRD.md`: Detailed product requirements and design direction.
- `CODEBASE_GUIDE.md`: Deep dive into architecture and data flow.
- `TESTING.md`: Comprehensive guide for all testing layers.
- `VISUAL_TESTING.md`: specific guide for Percy and visual regression.
- `src/lib/utils.ts`: Contains the `cn()` helper for class merging.
