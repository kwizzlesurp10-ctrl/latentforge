import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CanvasNodeComponent } from './CanvasNode'
import { createMockCanvasNode } from '@/test/mockData'

describe('CanvasNode', () => {
  const defaultProps = {
    node: createMockCanvasNode(),
    isSelected: false,
    onSelect: vi.fn(),
    onUpdate: vi.fn(),
    onDelete: vi.fn(),
  }

  it('should render node content', () => {
    const node = createMockCanvasNode({ content: 'Test node content' })
    render(<CanvasNodeComponent {...defaultProps} node={node} />)
    
    expect(screen.getByText('Test node content')).toBeInTheDocument()
  })

  it('should display node type label', () => {
    const node = createMockCanvasNode({ type: 'code' })
    render(<CanvasNodeComponent {...defaultProps} node={node} />)
    
    expect(screen.getByText('code')).toBeInTheDocument()
  })

  it('should call onSelect when node is clicked', () => {
    const onSelect = vi.fn()
    render(<CanvasNodeComponent {...defaultProps} onSelect={onSelect} />)
    
    const card = screen.getByRole('textbox').closest('div')
    fireEvent.mouseDown(card!)
    
    expect(onSelect).toHaveBeenCalled()
  })

  it('should call onDelete when delete button is clicked', async () => {
    const onDelete = vi.fn()
    const { container } = render(<CanvasNodeComponent {...defaultProps} onDelete={onDelete} />)
    
    const card = container.querySelector('.group')
    fireEvent.mouseEnter(card!)
    
    const deleteButtons = screen.getAllByRole('button')
    const deleteButton = deleteButtons.find(btn => btn.querySelector('.text-destructive'))
    
    fireEvent.click(deleteButton!)
    
    expect(onDelete).toHaveBeenCalled()
  })

  it('should call onUpdate when content changes', () => {
    const onUpdate = vi.fn()
    render(<CanvasNodeComponent {...defaultProps} onUpdate={onUpdate} />)
    
    const textarea = screen.getByRole('textbox')
    fireEvent.change(textarea, { target: { value: 'Updated content' } })
    
    expect(onUpdate).toHaveBeenCalledWith({ content: 'Updated content' })
  })

  it('should apply selected styles when isSelected is true', () => {
    const { container } = render(<CanvasNodeComponent {...defaultProps} isSelected={true} />)
    
    const card = container.querySelector('.border-primary')
    expect(card).toBeInTheDocument()
    expect(card).toHaveClass('glow-primary')
  })

  it('should not apply selected styles when isSelected is false', () => {
    const { container } = render(<CanvasNodeComponent {...defaultProps} isSelected={false} />)
    
    const card = container.querySelector('.border-primary')
    expect(card).not.toBeInTheDocument()
  })

  it('should use monospace font for code nodes', () => {
    const node = createMockCanvasNode({ type: 'code', content: 'const x = 1;' })
    render(<CanvasNodeComponent {...defaultProps} node={node} />)
    
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveClass('font-mono')
  })

  it('should have appropriate placeholder for code nodes', () => {
    const node = createMockCanvasNode({ type: 'code', content: '' })
    render(<CanvasNodeComponent {...defaultProps} node={node} />)
    
    const textarea = screen.getByPlaceholderText('// Write code...')
    expect(textarea).toBeInTheDocument()
  })

  it('should have appropriate placeholder for text nodes', () => {
    const node = createMockCanvasNode({ type: 'text', content: '' })
    render(<CanvasNodeComponent {...defaultProps} node={node} />)
    
    const textarea = screen.getByPlaceholderText('Type your idea...')
    expect(textarea).toBeInTheDocument()
  })
})
