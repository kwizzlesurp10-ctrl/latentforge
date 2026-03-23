import { VaultItem, CanvasNode, Connection, Agent } from '@/lib/types'

export const mockVaultItems: VaultItem[] = [
  {
    id: 'vault-1',
    content: 'Test vault item for code snippet',
    type: 'code',
    tags: ['testing', 'typescript'],
    createdAt: Date.now() - 86400000,
    updatedAt: Date.now() - 86400000,
    version: 1,
  },
  {
    id: 'vault-2',
    content: 'Sample prompt for AI generation',
    type: 'prompt',
    tags: ['ai', 'generation'],
    createdAt: Date.now() - 172800000,
    updatedAt: Date.now() - 172800000,
    version: 1,
  },
  {
    id: 'vault-3',
    content: 'Regular text note about project ideas',
    type: 'text',
    tags: ['ideas', 'brainstorm'],
    createdAt: Date.now() - 259200000,
    updatedAt: Date.now() - 259200000,
    version: 2,
  },
]

export const mockCanvasNodes: CanvasNode[] = [
  {
    id: 'node-1',
    type: 'text',
    content: 'Main concept node',
    position: { x: 100, y: 100 },
    size: { width: 300, height: 150 },
    connections: ['node-2'],
  },
  {
    id: 'node-2',
    type: 'code',
    content: 'function test() {\n  return true;\n}',
    position: { x: 500, y: 100 },
    size: { width: 300, height: 150 },
    connections: ['node-3'],
  },
  {
    id: 'node-3',
    type: 'mindmap',
    content: 'Implementation steps',
    position: { x: 300, y: 350 },
    size: { width: 300, height: 150 },
    connections: [],
  },
]

export const mockConnections: Connection[] = [
  {
    id: 'conn-1',
    source: 'node-1',
    target: 'node-2',
  },
  {
    id: 'conn-2',
    source: 'node-2',
    target: 'node-3',
  },
]

export const mockAgent: Agent = {
  id: 'agent-1',
  type: 'researcher',
  status: 'processing',
  input: 'Research quantum computing applications',
  outputs: [
    {
      id: 'output-1',
      content: 'Quantum computing has potential applications in cryptography...',
      timestamp: Date.now(),
    },
  ],
  createdAt: Date.now(),
}

export const createMockVaultItem = (overrides?: Partial<VaultItem>): VaultItem => ({
  id: `vault-${Date.now()}`,
  content: 'Mock content',
  type: 'text',
  tags: [],
  createdAt: Date.now(),
  updatedAt: Date.now(),
  version: 1,
  ...overrides,
})

export const createMockCanvasNode = (overrides?: Partial<CanvasNode>): CanvasNode => ({
  id: `node-${Date.now()}`,
  type: 'text',
  content: 'Mock node content',
  position: { x: 0, y: 0 },
  size: { width: 300, height: 150 },
  connections: [],
  ...overrides,
})
