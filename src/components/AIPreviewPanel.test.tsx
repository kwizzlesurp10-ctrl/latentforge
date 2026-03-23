import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { AIPreviewPanel } from './AIPreviewPanel'
import { mockVaultItems, mockCanvasNodes } from '@/test/mockData'

describe('AIPreviewPanel', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should show empty state when no item or node is selected', () => {
    render(<AIPreviewPanel onClose={vi.fn()} />)
    
    expect(screen.getByText(/Select a vault item or canvas node/i)).toBeInTheDocument()
  })

  it('should render with selected vault item', () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    expect(screen.getByText('AI Preview')).toBeInTheDocument()
    expect(screen.getByText('code')).toBeInTheDocument()
  })

  it('should render with selected canvas node', () => {
    render(<AIPreviewPanel selectedNode={mockCanvasNodes[0]} onClose={vi.fn()} />)
    
    expect(screen.getByText('AI Preview')).toBeInTheDocument()
    expect(screen.getByText('text')).toBeInTheDocument()
  })

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn()
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={onClose} />)
    
    const closeButton = screen.getByText('×')
    fireEvent.click(closeButton)
    
    expect(onClose).toHaveBeenCalled()
  })

  it('should render all mode tabs', () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    expect(screen.getByText('Refine')).toBeInTheDocument()
    expect(screen.getByText('Expand')).toBeInTheDocument()
    expect(screen.getByText('Extract')).toBeInTheDocument()
    expect(screen.getByText('Transform')).toBeInTheDocument()
  })

  it('should show generating state when processing', async () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument()
    }, { timeout: 100 })
  })

  it('should generate preview when mode is changed', async () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    await waitFor(() => {
      const result = screen.queryByText(/Mocked AI response/)
      expect(result).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should show copy button when generation is complete', async () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('Copy')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should show regenerate button when generation is complete', async () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    await waitFor(() => {
      expect(screen.getByText('Regenerate')).toBeInTheDocument()
    }, { timeout: 1000 })
  })

  it('should switch between modes', async () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    const expandTab = screen.getByText('Expand')
    fireEvent.click(expandTab)
    
    await waitFor(() => {
      expect(screen.getByText('Generating...')).toBeInTheDocument()
    }, { timeout: 100 })
  })

  it('should display content preview', () => {
    render(<AIPreviewPanel selectedItem={mockVaultItems[0]} onClose={vi.fn()} />)
    
    expect(screen.getByText('Test vault item for code snippet')).toBeInTheDocument()
  })
})
