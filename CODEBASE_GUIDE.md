# LatentForge — Codebase Guide

A developer-oriented reference for understanding the repository structure, key technologies, and how the code is organized.

> **Looking for user-facing documentation?** See [README.md](./README.md).  
> **Looking for the product specification?** See [PRD.md](./PRD.md).  
> **Looking for testing guidance?** See [TESTING.md](./TESTING.md).

---

## Table of Contents

1. [What This App Does](#1-what-this-app-does)
2. [Technology Stack](#2-technology-stack)
3. [Repository Layout](#3-repository-layout)
4. [Architecture Overview](#4-architecture-overview)
5. [Entry Points](#5-entry-points)
6. [Core Type System](#6-core-type-system)
7. [State Management](#7-state-management)
8. [Component Breakdown](#8-component-breakdown)
9. [Custom Hooks](#9-custom-hooks)
10. [Styling System](#10-styling-system)
11. [Testing Infrastructure](#11-testing-infrastructure)
12. [Build System](#12-build-system)
13. [How to Navigate the Codebase](#13-how-to-navigate-the-codebase)

---

## 1. What This App Does

**LatentForge** is a privacy-first, offline-capable web application for capturing, organizing, and transforming creative ideas. It is built on [GitHub Spark](https://github.com/features/copilot), which provides authentication, key-value persistence, and LLM access out of the box.

The five core capabilities are:

| Feature | Description |
|---|---|
| **Shadow Vault** | Quick-capture sidebar — store text snippets, code blocks, prompts, images, and files |
| **Forge Canvas** | Infinite pan/zoom workspace — place nodes, connect them, and visualize idea relationships |
| **AI Co-pilot** | Side panel that streams AI-generated refinements, expansions, extractions, or transformations of selected content |
| **Agent Swarm** | Specialized AI agents (researcher, code-architect, visualizer) that run in parallel |
| **Timeline Rebellion** | Non-linear history browser for resurrecting abandoned idea branches |

---

## 2. Technology Stack

### Runtime & Build

| Technology | Version | Role |
|---|---|---|
| **React** | 19 | UI component framework |
| **TypeScript** | 5.7 | Strict type safety across the entire codebase |
| **Vite** | 7.x | Dev server and production bundler (SWC compiler) |
| **GitHub Spark** | ≥0.43.1 | KV store, LLM API, GitHub OAuth — the backend |

### Styling

| Technology | Version | Role |
|---|---|---|
| **Tailwind CSS** | 4 | Utility-first class-based styling |
| **CSS Custom Properties** | — | Theme tokens (`--primary`, `--background`, etc.) |
| **Framer Motion** | 12.6 | Declarative animations |

### UI Components

| Library | Role |
|---|---|
| **Shadcn/ui v4** | 46+ pre-built, accessible components in `src/components/ui/` |
| **Radix UI Primitives** | Unstyled, accessible primitives that Shadcn is built on |
| **Phosphor Icons** | Duotone icon set (used throughout the app) |
| **Heroicons** | Additional SVG icons |

### Data & State

| Library | Role |
|---|---|
| **`@github/spark` `useKV`** | Persistent, synchronized key-value store (replaces Redux/Zustand) |
| **React `useState` / `useCallback`** | Ephemeral UI state (modal open/closed, selections, etc.) |
| **TanStack React Query** | Server-state management for any async data beyond KV |

### Testing

| Tool | Role |
|---|---|
| **Vitest** | Fast unit and component tests |
| **React Testing Library** | User-centric component rendering/assertions |
| **Happy DOM** | Lightweight DOM environment for unit tests |
| **Playwright** | Cross-browser end-to-end tests |
| **Percy** | Visual regression snapshots (4 viewport widths) |

### Utilities

| Library | Role |
|---|---|
| **date-fns** | Timestamp formatting in vault items |
| **marked** | Markdown parsing |
| **Zod** | Runtime schema validation |
| **Sonner** | Toast notifications |
| **uuid** | Unique ID generation |
| **clsx / class-variance-authority** | Conditional Tailwind class merging via the `cn()` helper |

---

## 3. Repository Layout

```
latentforge/
│
├── src/                        # All application source code
│   ├── components/
│   │   ├── canvas/             # Forge Canvas feature
│   │   ├── vault/              # Shadow Vault feature
│   │   └── ui/                 # 46 Shadcn/Radix UI components
│   │   ├── AIPreviewPanel.tsx  # AI Co-pilot side panel
│   │   ├── CommandPalette.tsx  # ⌘/ command palette modal
│   │   ├── EmptyState.tsx      # Reusable empty state UI
│   │   └── PWAInstallBanner.tsx
│   │
│   ├── hooks/
│   │   ├── use-mobile.ts       # Detects mobile viewport
│   │   └── use-pwa-install.ts  # Manages PWA install prompt state
│   │
│   ├── lib/
│   │   ├── types.ts            # All shared TypeScript interfaces
│   │   └── utils.ts            # `cn()` classname utility
│   │
│   ├── styles/
│   │   └── theme.css           # Additional CSS theme overrides
│   │
│   ├── test/
│   │   └── setup.ts            # Vitest global setup (RTL cleanup, mocks)
│   │
│   ├── App.tsx                 # Root component — layout + state orchestration
│   ├── ErrorFallback.tsx       # React Error Boundary fallback UI
│   ├── index.css               # Global theme tokens + Tailwind base styles
│   ├── main.css                # Additional global styles
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite/Spark type declarations
│
├── e2e/                        # Playwright end-to-end tests
│   ├── vault.spec.ts
│   ├── canvas.spec.ts
│   ├── ai-workflows.spec.ts
│   └── visual/                 # Percy visual regression tests
│
├── public/
│   └── manifest.json           # PWA manifest (name, icons, shortcuts)
│
├── index.html                  # HTML shell (mounts to #root)
│
├── Configuration
│   ├── vite.config.ts          # Build config (Spark plugin, path aliases)
│   ├── vitest.config.ts        # Unit test runner
│   ├── playwright.config.ts    # E2E test runner
│   ├── tailwind.config.js      # Tailwind theme extension
│   ├── tsconfig.json           # TypeScript compiler options
│   ├── components.json         # Shadcn CLI configuration
│   ├── theme.json              # Design token values
│   ├── .percyrc.yml            # Percy snapshot config
│   └── runtime.config.json     # Spark runtime ID
│
└── Documentation
    ├── README.md               # User-facing overview (quick start, features)
    ├── CODEBASE_GUIDE.md       # This file — developer reference
    ├── PRD.md                  # Product Requirements Document
    ├── TESTING.md              # Testing guide
    ├── VISUAL_TESTING.md       # Percy visual regression guide
    ├── PERCY_QUICKSTART.md     # Percy 5-minute setup
    ├── DARK_MODE_TESTING.md    # Dark mode test guide
    ├── CONTRIBUTING.md         # Contribution workflow
    └── SECURITY.md             # Security & privacy policies
```

---

## 4. Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         Browser / PWA                           │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │                       App.tsx                            │  │
│  │                                                          │  │
│  │   ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │  │
│  │   │ VaultSidebar │  │ ForgeCanvas  │  │AIPreviewPanel│  │  │
│  │   │  (left panel)│  │  (center)    │  │ (right panel)│  │  │
│  │   └──────┬───────┘  └──────┬───────┘  └──────┬───────┘  │  │
│  │          │                 │                  │          │  │
│  │   ┌──────▼─────────────────▼──────────────────▼───────┐  │  │
│  │   │                   Spark useKV                      │  │  │
│  │   │   vault-items   canvas-nodes   canvas-connections  │  │  │
│  │   └──────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
             │                              │
    ┌────────▼────────┐            ┌────────▼────────┐
    │  Spark KV Store │            │  Spark LLM API  │
    │ (row-level sec) │            │  (GPT-4o-mini)  │
    └────────┬────────┘            └─────────────────┘
             │
    ┌────────▼────────┐
    │  IndexedDB      │
    │ (offline cache) │
    └─────────────────┘
```

### Data Flow

1. **Persistent state** is stored via `useKV` (Spark KV) under three keys:
   - `vault-items` → `VaultItem[]`
   - `canvas-nodes` → `CanvasNode[]`
   - `canvas-connections` → `Connection[]`

2. **All CRUD callbacks** (`addVaultItem`, `updateVaultItem`, `deleteVaultItem`, `addCanvasNode`, etc.) are defined in `App.tsx` using `useCallback` and passed down as props.

3. **Selection state** is ephemeral (`useState` in `App.tsx`). Selecting a vault item or canvas node opens the `AIPreviewPanel` and passes the selected object to it.

4. **AI calls** go directly from `AIPreviewPanel` to the Spark LLM API using `spark.llm()` and `spark.llmPrompt`. The app simulates streaming by word-by-word rendering with `setTimeout`.

5. **UI state** (modals open/closed, sidebar visibility) stays in `App.tsx` as plain `useState`.

---

## 5. Entry Points

### `index.html`
The HTML shell. Contains a single `<div id="root">`. Vite injects `src/main.tsx` as a module script.

### `src/main.tsx`
```typescript
createRoot(document.getElementById('root')!).render(
  <ErrorBoundary FallbackComponent={ErrorFallback}>
    <App />
  </ErrorBoundary>
)
```
Responsibilities:
- Mounts the React tree onto `#root`
- Wraps everything in `react-error-boundary` so unhandled errors show `ErrorFallback` instead of a blank screen
- Imports `@github/spark/spark` (initializes Spark runtime)
- Imports all global CSS files (`main.css`, `styles/theme.css`, `index.css`)

### `src/App.tsx`
The root component. It owns all persistent and selection state, defines all mutation callbacks, and renders the top-level layout:

```
<TooltipProvider>
  <div>  ← full-screen flex column
    <header>    ← 56px toolbar
    <div>       ← flex row, fills remaining height
      <VaultSidebar />
      <ForgeCanvas />
      {isAIPreviewOpen && <AIPreviewPanel />}
    </div>
    <QuickCapture />   ← modal, conditionally rendered
    <CommandPalette /> ← modal, conditionally rendered
    <Toaster />
    <PWAInstallBanner />
  </div>
</TooltipProvider>
```

---

## 6. Core Type System

All shared TypeScript interfaces live in **`src/lib/types.ts`**.

### `VaultItem` — Idea storage unit
```typescript
interface VaultItem {
  id: string                                    // "vault-{timestamp}-{random}"
  content: string                               // The captured text/code/etc.
  type: 'text' | 'code' | 'image' | 'prompt' | 'file'
  tags: string[]                                // User-defined or AI-generated tags
  createdAt: number                             // Unix ms timestamp
  updatedAt: number                             // Auto-bumped on every update
  version: number                               // Incremented on each edit (git-like)
  parentId?: string                             // For versioned chains
}
```

### `CanvasNode` — Infinite canvas element
```typescript
interface CanvasNode {
  id: string                                    // "node-{timestamp}-{random}"
  type: 'text' | 'code' | 'image' | 'mindmap'
  content: string
  position: { x: number; y: number }           // Canvas coordinates (not screen)
  size: { width: number; height: number }
  connections: string[]                         // IDs of connected nodes
  style?: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
  }
}
```

### `Connection` — Edge between two canvas nodes
```typescript
interface Connection {
  id: string                                    // "conn-{timestamp}-{random}"
  source: string                                // CanvasNode id
  target: string                                // CanvasNode id
  style?: { color?: string; width?: number }
}
```

### `Agent` — AI agent execution record
```typescript
interface Agent {
  id: string
  type: 'researcher' | 'code-architect' | 'visualizer'
  status: 'idle' | 'processing' | 'complete' | 'error'
  input: string
  outputs: AgentOutput[]
  createdAt: number
}
```

### `TimelineNode` — History snapshot
```typescript
interface TimelineNode {
  id: string
  timestamp: number
  type: 'vault-item' | 'canvas-change' | 'agent-spawn' | 'export'
  description: string
  snapshot: any       // Full state at this point in time
  parentIds: string[] // Supports branching history (multiple parents)
}
```

### `StyleProfile` — Personal writing style model
```typescript
interface StyleProfile {
  id: string
  name: string
  trainingExamples: string[]
  createdAt: number
  active: boolean
}
```

### `ExportFormat` — Multi-target export descriptor
```typescript
interface ExportFormat {
  type: 'github' | 'notion' | 'twitter' | 'markdown' | 'json'
  content: string
  metadata?: Record<string, any>
}
```

---

## 7. State Management

LatentForge uses a **two-tier state model**:

### Tier 1 — Persistent State via Spark `useKV`

```typescript
// In App.tsx
const [vaultItems, setVaultItems] = useKV<VaultItem[]>('vault-items', [])
const [canvasNodes, setCanvasNodes] = useKV<CanvasNode[]>('canvas-nodes', [])
const [connections, setConnections] = useKV<Connection[]>('canvas-connections', [])
```

`useKV` behaves like `useState` but writes to Spark KV on every change. Data is:
- Persisted across page reloads
- Isolated per GitHub user (row-level security)
- Available offline via IndexedDB fallback

### Tier 2 — Ephemeral UI State via `useState`

```typescript
// Modal visibility
const [isSidebarOpen, setIsSidebarOpen] = useState(true)
const [isCommandOpen, setIsCommandOpen] = useState(false)
const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
const [isAIPreviewOpen, setIsAIPreviewOpen] = useState(false)

// Selection (mutually exclusive between vault and canvas)
const [selectedVaultItemId, setSelectedVaultItemId] = useState<string | null>(null)
const [selectedCanvasNodeId, setSelectedCanvasNodeId] = useState<string | null>(null)
```

All mutation functions are wrapped in `useCallback` to prevent unnecessary re-renders:

```typescript
const addVaultItem = useCallback((item) => {
  const newItem: VaultItem = {
    ...item,
    id: `vault-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    version: 1,
  }
  setVaultItems((current) => [newItem, ...(current || [])])
  return newItem
}, [setVaultItems])
```

---

## 8. Component Breakdown

### `src/components/vault/VaultSidebar.tsx`

The left sidebar panel for the Shadow Vault.

**Props received from `App.tsx`**: `items`, `isOpen`, `onAddItem`, `onUpdateItem`, `onDeleteItem`, `onClose`, `selectedItemId`, `onSelectItem`

**Internal state**:
- `activeTab` — `'all'` or `'tags'`
- `selectedTags` — array of currently filtered tag strings

**Key behaviors**:
- Derives `allTags` from the deduplicated union of all item tags
- Filters `filteredItems` based on the active tab and selected tags
- Shows type-specific icons (`FileText`, `Code`, `ImageIcon`, `Lightning`) from Phosphor
- Clicking an item calls `onSelectItem(id)` → triggers `AIPreviewPanel` to open
- Delete button is hidden by default; appears on card hover via CSS `group-hover`

---

### `src/components/vault/QuickCapture.tsx`

The `⌘K` quick-capture modal.

**Behavior**: Opens as a dialog, lets the user type a note and pick a type, then calls `onSave` (wired to `addVaultItem` in `App.tsx`) and closes.

---

### `src/components/canvas/ForgeCanvas.tsx`

The infinite canvas workspace.

**Props received from `App.tsx`**: `nodes`, `connections`, `onAddNode`, `onUpdateNode`, `onDeleteNode`, `onAddConnection`, `selectedNodeId`, `onSelectNode`

**Internal state**:
- `pan: { x, y }` — current pan offset in pixels
- `zoom` — current scale factor (range: `0.25` – `2.0`)
- `isPanning`, `panStart` — mouse tracking for drag-to-pan

**Coordinate system**:  
Nodes store positions in **canvas space** (before pan/zoom). The rendered transform is:
```
transform: translate(${pan.x}px, ${pan.y}px) scale(${zoom})
```
When placing a new node, its canvas-space coordinates are computed as:
```typescript
x: (centerX - pan.x) / zoom - 150   // 150 = half the default node width
```

**Connections** are rendered as SVG `<line>` elements at the canvas level. Their screen-space endpoints are computed by converting node centers through the current pan/zoom:
```typescript
x1 = (node.position.x + node.size.width / 2) * zoom + pan.x
```

**Keyboard shortcuts** registered via `useEffect`:
- `⌘0` / `Ctrl+0` — reset pan and zoom
- `Delete` — delete the selected node

---

### `src/components/canvas/CanvasNode.tsx`

Renders a single node on the canvas. Receives a `CanvasNode` object and callbacks. Handles drag-to-reposition by tracking `mousedown`/`mousemove`/`mouseup` and calling `onUpdate` with updated position.

---

### `src/components/AIPreviewPanel.tsx`

The right-side AI co-pilot panel. Opens when a vault item or canvas node is selected.

**Props**: `selectedItem`, `selectedNode`, `onClose`

**Internal state**:
- `mode: PreviewMode` — `'refine' | 'expand' | 'extract' | 'transform'`
- `result: { content, isComplete }` — the current AI output
- `isGenerating` — whether a request is in flight
- `copied` — controls the copy button feedback state

**AI call flow**:
1. `generatePreview(mode)` builds a `spark.llmPrompt` template based on the mode and content type
2. Calls `spark.llm(prompt, 'gpt-4o-mini', false)`
3. Simulates word-by-word streaming by splitting the response on spaces and using `setTimeout(30ms)` per word
4. Displays a pulsing indicator while `isComplete` is `false`

**Auto-trigger**: A `useEffect` watches `selectedItem?.id` and `selectedNode?.id`; switching selection automatically regenerates the preview with the current mode.

---

### `src/components/CommandPalette.tsx`

The `⌘/` command palette modal. Lists available commands and actions. Calling `onOpenQuickCapture` from within it closes the palette and opens `QuickCapture`.

---

### `src/components/PWAInstallBanner.tsx`

Uses `use-pwa-install.ts` to detect if the PWA install prompt is available. Auto-shows a dismissible banner after 3 seconds on first visit. Persists dismissal state.

---

### `src/components/ui/`

Contains **46 Shadcn/Radix UI components**, added via the Shadcn CLI (`components.json`). These are treated as source files — they live in the repo and can be customized directly. Key components used throughout the app:

| Component | Used in |
|---|---|
| `button.tsx` | Everywhere |
| `card.tsx` | VaultSidebar item cards, AIPreviewPanel results |
| `tabs.tsx` | VaultSidebar (All/Tags), AIPreviewPanel (mode selector) |
| `scroll-area.tsx` | VaultSidebar list, AIPreviewPanel content |
| `badge.tsx` | Tags, type labels |
| `dialog.tsx` | QuickCapture modal base |
| `tooltip.tsx` | Header buttons |
| `sonner.tsx` | Toast notifications |

---

## 9. Custom Hooks

### `src/hooks/use-mobile.ts`
Returns `true` if the viewport width is below the mobile breakpoint. Used to conditionally hide or collapse UI elements on small screens.

### `src/hooks/use-pwa-install.ts`
Manages the `beforeinstallprompt` browser event lifecycle:
- Captures and stores the deferred install prompt
- Exposes `canInstall` boolean and `install()` trigger function
- Tracks whether the app is already running in standalone mode

---

## 10. Styling System

### Theme Architecture

The app uses **CSS Custom Properties** for all design tokens, defined in `src/index.css`:

```css
:root {
  --primary: oklch(0.65 0.28 330);     /* Electric Magenta */
  --secondary: oklch(0.75 0.15 195);   /* Cyber Cyan */
  --accent: oklch(0.85 0.18 195);      /* Neon Cyan */
  --background: oklch(0.12 0.01 270);  /* Obsidian */
  --card: oklch(0.18 0.02 270);        /* Charcoal */
  --muted: oklch(0.25 0.05 270);       /* Vein Glow */
}
```

Colors use the **oklch color space** for perceptual uniformity.

Tailwind is configured in `tailwind.config.js` to read these tokens, so Tailwind classes like `bg-primary`, `text-secondary`, and `border-border` all map to the custom properties.

### Typography

| Font | CSS Variable | Usage |
|---|---|---|
| Space Grotesk | `font-display` | Headers, logo |
| Inter Variable | `font-body` (default) | Body text |
| JetBrains Mono | `font-mono` | Code blocks |

### Glow Effects

Custom utility classes in `index.css` provide the neon glow aesthetic:
- `.glow-primary` — magenta box-shadow
- `.glow-hover` — cyan glow on hover
- `.glow-secondary` — cyan box-shadow

---

## 11. Testing Infrastructure

### Unit Tests (Vitest + React Testing Library)

**Config**: `vitest.config.ts`  
**Environment**: Happy DOM (lightweight DOM, faster than jsdom)  
**Setup file**: `src/test/setup.ts` (RTL cleanup, any global mocks)  
**Run**: `npm test` (watch) or `npm run test:run` (single pass)

Test files live next to the components they test:
```
src/components/canvas/ForgeCanvas.test.tsx
src/components/canvas/CanvasNode.test.tsx
src/components/vault/VaultSidebar.test.tsx
src/components/AIPreviewPanel.test.tsx
```

### End-to-End Tests (Playwright)

**Config**: `playwright.config.ts`  
**Dev server**: Auto-started at `http://localhost:5173` by Playwright  
**Browsers**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari  
**Run**: `npm run test:e2e`

Test files:
```
e2e/vault.spec.ts          — vault CRUD workflows
e2e/canvas.spec.ts         — pan, zoom, node operations
e2e/ai-workflows.spec.ts   — AI panel and agent testing
```

### Visual Regression Tests (Percy)

**Config**: `.percyrc.yml`  
**Viewports**: 375, 768, 1280, 1920px  
**Run**: `npm run test:visual`

See [VISUAL_TESTING.md](./VISUAL_TESTING.md) for baseline management.

---

## 12. Build System

### Development

```bash
npm run dev       # Vite dev server on :5173 with HMR
```

### Production Build

```bash
npm run build     # tsc (type-check only, no emit) → vite build → dist/
npm run preview   # Serve dist/ locally for verification
```

### Vite Configuration (`vite.config.ts`)

Key plugins:
- `@vitejs/plugin-react-swc` — Fast React Fast Refresh via SWC
- `@tailwindcss/vite` — First-class Tailwind CSS 4 support
- `@github/spark/vite-plugin` — Injects Spark runtime and proxies icon requests
- `vite-plugin-pwa` (if configured) — Service worker generation

Path alias:
```typescript
resolve: { alias: { '@': path.resolve(__dirname, './src') } }
```

This is why all imports look like `@/components/...` or `@/lib/types`.

---

## 13. How to Navigate the Codebase

### Starting Points by Task

| Task | Where to look |
|---|---|
| Understand the app layout | `src/App.tsx` |
| Add a new vault item type | `src/lib/types.ts` → `VaultItem.type` union, then `VaultSidebar.tsx` |
| Add a new canvas node type | `src/lib/types.ts` → `CanvasNode.type` union, then `ForgeCanvas.tsx` and `CanvasNode.tsx` |
| Change AI prompts | `src/components/AIPreviewPanel.tsx` → `generatePreview()` |
| Add a new AI agent | `src/lib/types.ts` → `Agent.type`, then the Agent Swarm component |
| Change theme colors | `src/index.css` → `:root` CSS custom properties |
| Add a new keyboard shortcut | `src/App.tsx` or the relevant component's `useEffect` |
| Add a new Shadcn component | `npx shadcn add <component>` (reads `components.json`) |
| Write a unit test | Create `*.test.tsx` next to the component, import from `@testing-library/react` |
| Write an E2E test | Create `*.spec.ts` in `e2e/`, use Playwright APIs |

### ID Conventions

All entity IDs are generated at creation time using this pattern:
```typescript
id: `vault-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
id: `node-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
id: `conn-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
```

### `cn()` Utility

All conditional Tailwind class merging uses the `cn()` helper from `src/lib/utils.ts`:
```typescript
import { cn } from '@/lib/utils'

<div className={cn('base-class', isActive && 'active-class', condition ? 'a' : 'b')} />
```

`cn()` combines `clsx` (conditional classes) with `tailwind-merge` (deduplicates conflicting Tailwind utilities).

### Spark-Specific APIs

Two Spark APIs appear in the codebase:

```typescript
// Persistent key-value storage (like useState but synced to the cloud)
const [value, setValue] = useKV<T>('key', defaultValue)

// LLM call with tagged template prompt
const prompt = spark.llmPrompt`Your prompt with ${interpolations}`
const response = await spark.llm(prompt, 'gpt-4o-mini', false)
```

Both are available only when running inside a Spark environment. For self-hosted deployments, these need to be swapped for equivalents (e.g., localStorage for KV, OpenAI SDK for LLM).
