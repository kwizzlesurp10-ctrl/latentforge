# LatentForge PRD

The personal latent-space forge where creators, coders, and chaos agents collapse ideas into living artifacts before the corporate AIs memory-hole them.

**Experience Qualities**:
1. **Feral** - Raw, unfiltered creative power without sanitization or handholding; the interface should feel like a tool forged in digital rebellion
2. **Visceral** - Every interaction leaves a glowing trace; ideas mutate visibly in real-time with AI co-pilots that remember your chaos, not corporate templates
3. **Insurgent** - Built for the builders squatting in the ruins; anti-corporate soul-suck with offline-first capabilities and zero compromise on creative sovereignty

**Complexity Level**: Complex Application (advanced functionality with multiple views)
Multiple sophisticated features including infinite canvas, AI integration, version control visualization, agent orchestration, and multi-modal exports. Requires advanced state management, real-time preview systems, and seamless coordination between vault storage, canvas manipulation, and AI streaming.

## Essential Features

### Shadow Vault - Encrypted Idea Capture
- **Functionality**: Quick-capture bar accessible via ⌘K, auto-tagging with semantic clustering, drag-drop file/prompt/screenshot support, git-like versioned snapshots with diffs
- **Purpose**: Capture fleeting thoughts before they dissolve; build a personal knowledge fortress that evolves with your creative chaos
- **Trigger**: ⌘K from anywhere, or drag-drop into sidebar
- **Progression**: Open capture modal → Type/paste/drop content → Auto-tags suggest → Save → Semantic cluster in vault → Version snapshot created
- **Success criteria**: Sub-100ms capture modal appearance, zero data loss, visible version history with diff visualization, semantic grouping that actually makes sense

### Forge Canvas - Infinite Hybrid Workspace
- **Functionality**: Infinite canvas supporting text nodes, mindmap connections, code blocks with syntax highlighting, image embeds; lasso-to-prompt any selection for AI refinement
- **Purpose**: Non-linear thinking space where ideas connect organically; traditional documents are linear prisons
- **Trigger**: Main workspace on dashboard, always accessible
- **Progression**: Add node (text/code/image) → Drag to position → Connect related nodes → Lasso selection → Generate AI prompt → Live preview → Accept/iterate
- **Success criteria**: Smooth 60fps pan/zoom, instant node creation, real-time connection rendering, lasso selection feels tactile, AI previews stream progressively

### Style LoRA Trainer - Personal Vibe Transfer
- **Functionality**: Upload 5-20 examples of personal writing/code/aesthetic → Train lightweight style adapter → Apply to all AI generations
- **Purpose**: AI that sounds like you, not like OpenAI's sanitized corporate voice; creative sovereignty over generated content
- **Trigger**: Settings panel or inline "Train on this" button on vault items
- **Progression**: Select 5-20 vault items → Click "Train Style Adapter" → Processing (30-60s) → Style profile saved → All future AI calls use personal vibe
- **Success criteria**: Noticeably different tone in outputs, training completes in under 90s, style persists across sessions

### Agent Swarm Launcher
- **Functionality**: One-click spawn specialized agents (researcher, code-architect, visualizer) that chain operations inside vault, stream results live with undo tree
- **Purpose**: Parallel creative intelligence; one idea spawns three divergent explorations simultaneously
- **Trigger**: Command palette or right-click context menu on canvas/vault items
- **Progression**: Select content → Choose agent type → Agent launches → Multiple results stream in parallel → Review in undo tree → Cherry-pick best mutations → Merge or discard
- **Success criteria**: Agents launch in <500ms, results stream with progressive updates, undo tree visualizes all branches, no race conditions

### Timeline Rebellion - Non-linear History
- **Functionality**: Visual timeline showing idea evolution across sessions, resurrect dead branches, merge timelines like adversarial git
- **Progression**: Open timeline view → Scrub through history → See divergent branches → Click to resurrect old version → Merge with current → Resolve conflicts visually
- **Purpose**: Ideas don't evolve linearly; dead ends often contain treasure; traditional undo is a linear prison
- **Trigger**: ⌘T or timeline icon in header
- **Success criteria**: Every vault/canvas change tracked, timeline scrubbing feels cinematic, branch resurrection works flawlessly, merge conflicts show visual diffs

### Export Arsenal - Multi-format Publishing
- **Functionality**: One-click export to GitHub issue, Notion page, tweet thread draft, markdown manifesto, raw JSON for downstream agents
- **Purpose**: Ideas locked in proprietary formats die; open export = creative immortality
- **Trigger**: Export button on any vault item or canvas selection
- **Progression**: Select content → Choose export format → Preview transformation → Copy or direct publish → Confirmation
- **Success criteria**: All formats render correctly, GitHub/Notion integrations work seamlessly, markdown preserves structure, JSON is agent-readable

## Edge Case Handling
- **Offline Mode**: Service worker caches all static assets, IndexedDB persists vault + canvas state, sync queue fires when reconnected
- **AI Failures**: Graceful degradation with retry logic, cached results where possible, clear error states with escape hatches
- **Large Canvases**: Virtualized rendering for 1000+ nodes, intelligent culling outside viewport, chunk-based loading
- **Merge Conflicts**: Visual diff with side-by-side comparison, accept theirs/mine/manual merge options, never auto-resolve silently
- **File Upload Limits**: Client-side compression for images, chunked upload for large files, clear size warnings before upload
- **Concurrent Agents**: Request queue with max 3 simultaneous agents, visible queue status, cancel anytime

## Design Direction
LatentForge should feel like a weapon forged in digital rebellion - cyberpunk aesthetics meet bioluminescent code. The interface glows with insurgent energy: neon veins pulsing through obsidian void, glitch artifacts on hover, electric traces left by every interaction. Think 2049 blade-runner terminals meets neural-interface HUDs, but faster and more feral. Every button should feel like triggering a controlled detonation of creative potential.

## Color Selection
Cyberpunk neon-panda palette: electric shock against void, bioluminescent code mutations

- **Primary Color (Electric Magenta)**: `oklch(0.65 0.28 330)` - Insurgent energy, primary CTAs, active states; communicates creative rebellion and urgency
- **Secondary Colors**: 
  - Cyber Cyan: `oklch(0.75 0.15 195)` - Supporting actions, hover states, connection lines
  - Neural Indigo: `oklch(0.55 0.20 270)` - Accent elements, secondary buttons, tag backgrounds
- **Accent Color (Neon Cyan)**: `oklch(0.85 0.18 195)` - Critical CTAs, agent spawn buttons, timeline highlights; laser-focused attention on power moves
- **Background Layers**:
  - Obsidian Base: `oklch(0.12 0.01 270)` - Primary background, the void from which ideas emerge
  - Charcoal Card: `oklch(0.18 0.02 270)` - Elevated surfaces, vault panels, modals
  - Vein Glow Muted: `oklch(0.25 0.05 270)` - Tertiary surfaces, inactive states
- **Foreground/Background Pairings**:
  - Primary Magenta (`oklch(0.65 0.28 330)`): White text (`oklch(0.98 0 0)`) - Ratio 5.2:1 ✓
  - Obsidian Base (`oklch(0.12 0.01 270)`): Cyber Cyan text (`oklch(0.75 0.15 195)`) - Ratio 8.1:1 ✓
  - Charcoal Card (`oklch(0.18 0.02 270)`): White text (`oklch(0.98 0 0)`) - Ratio 12.3:1 ✓
  - Accent Cyan (`oklch(0.85 0.18 195)`): Obsidian text (`oklch(0.12 0.01 270)`) - Ratio 11.5:1 ✓

## Font Selection
Typography must convey insurgent intelligence: monospaced precision for code and data, geometric brutalism for UI, editorial sharpness for content.

- **Primary (UI & Headers)**: Space Grotesk - Geometric sans with technical precision and subtle cyberpunk edge; conveys forward-momentum and digital craftsmanship
- **Code/Data**: JetBrains Mono - Battle-tested monospace with excellent ligatures for code blocks, terminal outputs, and technical content
- **Content/Body**: Inter Variable - Crisp readability for long-form vault content with excellent screen rendering

**Typographic Hierarchy**:
- H1 (App Title/Hero): Space Grotesk Bold/32px/tracking-tight/leading-none
- H2 (Section Headers): Space Grotesk SemiBold/24px/tracking-tight/leading-tight
- H3 (Subsections): Space Grotesk Medium/18px/tracking-normal/leading-snug
- Body (Vault Content): Inter Variable Regular/15px/tracking-normal/leading-relaxed
- UI Labels: Space Grotesk Medium/13px/tracking-wide uppercase/leading-none
- Code Blocks: JetBrains Mono Regular/14px/tracking-normal/leading-relaxed
- Captions/Meta: Inter Variable Regular/12px/tracking-normal/leading-normal/text-muted-foreground

## Animations
Animations should feel like controlled electrical surges through neural pathways - quick, purposeful, leaving glowing traces. Every interaction pulses with insurgent energy.

**Functional Animations**:
- Quick-capture modal (⌘K): Slide-up from bottom with scale-in (200ms ease-out) + backdrop blur fade
- Canvas node creation: Pop-in with electric ripple effect (150ms spring physics)
- Agent spawn: Radial pulse from spawn point + particle burst (300ms) as agent cards stream in
- Vault item save: Subtle glow pulse on success (400ms) with micro-confetti shrapnel
- Connection lines: Animate draw from source to target with neon trail (250ms ease-in-out)
- Timeline scrub: Smooth parallax scroll with glitch artifacts at branch points
- Hover states: Glow intensification (100ms) + subtle scale (1.02x) on interactive elements

**Delight Moments**:
- Successful agent completion: Brief confetti shrapnel burst in accent colors
- Timeline branch resurrection: Glitch transition effect as old version materializes
- Export completion: Neon success toast slides from corner with pulsing glow

## Component Selection

**Components**:
- **Command Palette** (⌘K): Cmdk component for quick-capture + universal search; customized with neon glow borders, glitch hover states
- **Canvas**: Custom component using HTML5 Canvas or SVG with pan/zoom transforms, Framer Motion for node animations
- **Vault Sidebar**: Sheet component (collapsible drawer) with ScrollArea for infinite list, customized dark theme
- **Cards**: Card component for vault items, agent results, timeline nodes; heavy shadow + neon border on hover
- **Buttons**: Button component with custom variants (primary-magenta, secondary-cyan, ghost-glow); all states have distinct glow intensities
- **Input Fields**: Input component with neon focus rings, glitch effect on validation errors
- **Modals/Dialogs**: Dialog component for settings, style trainer, export previews; backdrop blur + charcoal cards
- **Toast Notifications**: Sonner configured with cyberpunk theme, neon borders, auto-dismiss
- **Tabs**: Tabs component for switching between vault views (All/Tags/Timeline/Agents)
- **Dropdown Menus**: DropdownMenu for context actions, export options, agent selection
- **Tooltips**: Tooltip component with hotkey legends, subtle glow, 100ms delay
- **Progress Indicators**: Progress component for AI streaming, style training; animated neon fill
- **Badges**: Badge component for tags, status indicators; pill-shaped with category colors

**Customizations**:
- Custom Canvas component for infinite workspace (not provided by Shadcn)
- Custom Timeline visualization with SVG branch diagrams and glitch transitions
- Custom Agent Swarm panel with streaming result cards
- Glitch effect utility component for hover states and transitions
- Neon glow border utility using CSS box-shadow layers

**States**:
- Buttons: Default (subtle glow) → Hover (intensified glow + scale 1.02) → Active (pressed, scale 0.98) → Disabled (40% opacity, no glow)
- Input fields: Default (border-input) → Focus (neon ring, electric-magenta) → Error (glitch shake + red glow) → Success (cyan pulse)
- Canvas nodes: Default → Hover (glow border) → Selected (strong magenta outline) → Dragging (elevated shadow + trail effect)
- Agent cards: Idle → Processing (pulsing glow) → Complete (success pulse) → Error (red glitch)

**Icon Selection**:
- Lightning bolt (agent spawn, quick actions)
- GitBranch (timeline, version control)
- Sparkles (AI refinement, style transfer)
- Archive (vault, storage)
- Code (code blocks, technical content)
- Image (visual content, moodboards)
- Link (connections, relationships)
- Download/Upload (export/import)
- Trash (delete actions)
- Eye/EyeSlash (preview toggles)

**Spacing**:
- Container padding: p-6 (desktop), p-4 (mobile)
- Card internal padding: p-5
- Vault item gaps: gap-3 (vertical list)
- Canvas node padding: p-4
- Button padding: px-5 py-2.5 (default), px-4 py-2 (small)
- Section spacing: mb-8 (major sections), mb-4 (subsections)
- Grid gaps: gap-6 (desktop), gap-4 (mobile)

**Mobile**:
- Vault sidebar: Full-screen Sheet slides from bottom on mobile, persistent sidebar on desktop
- Quick-capture: Bottom sheet on mobile (⌘K or FAB), centered modal on desktop
- Canvas: Touch gestures (pinch-zoom, two-finger pan), simplified toolbar in bottom bar
- Timeline: Horizontal scroll on mobile (swipe), vertical on desktop
- Agent panel: Stacked cards on mobile, grid on desktop
- Command palette: Full-screen on mobile, floating on desktop (max-w-2xl)
