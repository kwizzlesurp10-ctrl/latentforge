export interface VaultItem {
  id: string
  content: string
  type: 'text' | 'code' | 'image' | 'prompt' | 'file'
  tags: string[]
  createdAt: number
  updatedAt: number
  version: number
  parentId?: string
}

export interface CanvasNode {
  id: string
  type: 'text' | 'code' | 'image' | 'mindmap'
  content: string
  position: { x: number; y: number }
  size: { width: number; height: number }
  connections: string[]
  style?: {
    backgroundColor?: string
    borderColor?: string
    textColor?: string
  }
}

export interface Connection {
  id: string
  source: string
  target: string
  style?: {
    color?: string
    width?: number
  }
}

export interface Agent {
  id: string
  type: 'researcher' | 'code-architect' | 'visualizer'
  status: 'idle' | 'processing' | 'complete' | 'error'
  input: string
  outputs: AgentOutput[]
  createdAt: number
}

export interface AgentOutput {
  id: string
  content: string
  timestamp: number
  vaultItemId?: string
}

export interface TimelineNode {
  id: string
  timestamp: number
  type: 'vault-item' | 'canvas-change' | 'agent-spawn' | 'export'
  description: string
  snapshot: any
  parentIds: string[]
}

export interface StyleProfile {
  id: string
  name: string
  trainingExamples: string[]
  createdAt: number
  active: boolean
}

export interface ExportFormat {
  type: 'github' | 'notion' | 'twitter' | 'markdown' | 'json'
  content: string
  metadata?: Record<string, any>
}

export interface UserSettings {
  canvas: {
    zoomSpeed: number
    panSensitivity: number
  }
  ui: {
    showMinimap: boolean
    showGrid: boolean
  }
  keyboard: {
    enableShortcuts: boolean
  }
}
