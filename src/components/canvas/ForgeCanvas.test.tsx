import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ForgeCanvas } from './ForgeCanvas'
import { mockCanvasNodes, mockConnections } from '@/test/mockData'

describe('ForgeCanvas', () => {
  const defaultProps = {
    nodes: [],
    connections: [],
    onAddNode: vi.fn(() => ({ id: 'new-node', type: 'text' as const, content: '', position: { x: 0, y: 0 }, size: { width: 300, height: 150 }, connections: [] })),
    onUpdateNode: vi.fn(),
    onDeleteNode: vi.fn(),
    onAddConnection: vi.fn(),
    selectedNodeId: null,
    onSelectNode: vi.fn(),
  }

  it('should render canvas with toolbar buttons', () => {
    render(<ForgeCanvas {...defaultProps} />)
    
    expect(screen.getByText('Text')).toBeInTheDocument()
    expect(screen.getByText('Code')).toBeInTheDocument()
    expect(screen.getByText('Image')).toBeInTheDocument()
  })

  it('should show empty state when no nodes exist', () => {
    render(<ForgeCanvas {...defaultProps} />)
    
    expect(screen.getByText(/Click a button above to add your first node/i)).toBeInTheDocument()
  })

  it('should render nodes when provided', () => {
    render(<ForgeCanvas {...defaultProps} nodes={mockCanvasNodes} />)
    
    expect(screen.getByText('Main concept node')).toBeInTheDocument()
    expect(screen.getByText(/function test/)).toBeInTheDocument()
  })

  it('should call onAddNode when adding text node', () => {
    const onAddNode = vi.fn(() => ({ id: 'new-node', type: 'text' as const, content: 'Type your idea...', position: { x: 0, y: 0 }, size: { width: 300, height: 150 }, connections: [] }))
    render(<ForgeCanvas {...defaultProps} onAddNode={onAddNode} />)
    
    const textButton = screen.getByText('Text').closest('button')
    fireEvent.click(textButton!)
    
    expect(onAddNode).toHaveBeenCalled()
  })

  it('should call onAddNode when adding code node', () => {
    const onAddNode = vi.fn(() => ({ id: 'new-node', type: 'code' as const, content: '// Start coding...', position: { x: 0, y: 0 }, size: { width: 300, height: 150 }, connections: [] }))
    render(<ForgeCanvas {...defaultProps} onAddNode={onAddNode} />)
    
    const codeButton = screen.getByText('Code').closest('button')
    fireEvent.click(codeButton!)
    
    expect(onAddNode).toHaveBeenCalled()
  })

  it('should display zoom controls', () => {
    render(<ForgeCanvas {...defaultProps} />)
    
    expect(screen.getByText('100%')).toBeInTheDocument()
    expect(screen.getByText('−')).toBeInTheDocument()
    expect(screen.getByText('+')).toBeInTheDocument()
  })

  it('should render connections between nodes', () => {
    const { container } = render(
      <ForgeCanvas 
        {...defaultProps} 
        nodes={mockCanvasNodes} 
        connections={mockConnections} 
      />
    )
    
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    
    const lines = container.querySelectorAll('line')
    expect(lines.length).toBe(mockConnections.length)
  })

  it('should highlight selected node', () => {
    render(
      <ForgeCanvas 
        {...defaultProps} 
        nodes={mockCanvasNodes}
        selectedNodeId="node-1"
      />
    )
    
    const selectedCard = screen.getByText('Main concept node').closest('.border-primary')
    expect(selectedCard).toBeInTheDocument()
  })

  it('should call onSelectNode when clicking canvas background', () => {
    const onSelectNode = vi.fn()
    const { container } = render(
      <ForgeCanvas {...defaultProps} onSelectNode={onSelectNode} />
    )
    
    const canvas = container.querySelector('.canvas-background')
    fireEvent.mouseDown(canvas!)
    
    expect(onSelectNode).toHaveBeenCalledWith(null)
  })
})
