# 🗺️ LatentForge Development Roadmap

This roadmap outlines the path from the current production-ready foundation to the full vision of a "creative latent-space forge."

---

## ✅ Phase 1: Foundations & Core Interactivity
*Focus: Closing gaps in existing features and enhancing the basic workspace loop.*

- [x] **Interactive Node Connections**: Implement UI gestures to manually connect nodes on the canvas (drag-to-connect).
- [x] **Rich Markdown Rendering**: Replace plain text previews in `AIPreviewPanel` and `VaultSidebar` with a full Markdown renderer (e.g., `react-markdown`) for headers, lists, and formatting.
- [x] **Timeline Rebellion (v1)**: 
    - [x] Implement `TimelineView` component.
    - [x] Build state snapshotting logic to populate `TimelineNode` history.
    - [x] Add basic "branch resurrection" functionality.
- [x] **Enhanced Vault Filtering**: Add multi-tag selection and advanced search (semantic + fuzzy) to the Shadow Vault.

## ✅ Phase 2: Intelligence & Orchestration
*Focus: Scaling AI capabilities from single-node insights to complex agent workflows.*

- [x] **Agent Swarm Launcher**:
    - [x] Implement the UI for spawning specialized agents (Researcher, Code Architect, Visualizer).
    - [x] Develop parallel execution logic and streaming results UI.
- [x] **Multi-node AI Prompting**: Extend the `AIPreviewPanel` to handle multiple selected nodes for synthesis, extraction, or batch transformations.
- [x] **Semantic Auto-Tagging**: Trigger AI calls automatically upon saving to suggest tags and perform semantic clustering in the vault.
- [x] **Voice Capture**: Add a microphone button to `QuickCapture` using the Web Speech API for "thought-to-text" capture.

## 🎨 Phase 3: UX Refinement & Polish
*Focus: Performance, PWA features, and advanced canvas interactions.*

- [x] **Export Arsenal**: Complete transformation logic for GitHub Issues, Notion, and Markdown exports.
- [x] **Enhanced Minimap**: Allow jump-panning by clicking or dragging directly on the minimap preview.
- [─] **Auto-Layout (Graph Physics)**: Integrate a force-directed layout (e.g., via `d3-force`) to automatically organize node clusters.
- [ ] **Canvas Performance (LOD)**: Implement "Level of Detail" rendering to maintain 60fps with 1000+ nodes by simplifying nodes at low zoom levels.
- [ ] **PWA & Offline Robustness**:
    - [ ] Complete `service-worker.js` for full offline-first reliability.
    - [ ] Add PWA Shortcuts (Quick Capture, New Node) to `manifest.json`.

## 🧬 Phase 4: Sovereignty & Personalization
*Focus: Deep customization and personal AI alignment.*

- [ ] **Style LoRA Trainer**:
    - [ ] Build the interface for uploading 5-20 personal examples (writing/code).
    - [ ] Implement the logic to apply these "style profiles" to all future AI generations.
- [ ] **Advanced Theme Editor**: Add a "Vibe" section in `SettingsDialog` to directly modify OKLCH CSS variables for a custom aesthetic.
- [ ] **Timeline Merging**: Implement advanced "adversarial git" merging for complex history branches.
- [ ] **Plugin System**: Create a lightweight API for community-contributed agent types and canvas node modalities.

---

## ✅ Legend
- [ ] **Planned**
- [─] **In Progress**
- [x] **Completed**
