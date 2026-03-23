import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { CommandPalette } from './CommandPalette'

describe('CommandPalette', () => {
  const defaultProps = {
    isOpen: true,
    onClose: vi.fn(),
    onOpenQuickCapture: vi.fn(),
    onViewAllItems: vi.fn(),
    onFilterByType: vi.fn(),
    onOpenAIPreview: vi.fn(),
  }

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('should render all command groups when open', () => {
    render(<CommandPalette {...defaultProps} />)

    expect(screen.getByText('Quick Actions')).toBeInTheDocument()
    expect(screen.getByText('Vault')).toBeInTheDocument()
    expect(screen.getByText('AI Co-pilot')).toBeInTheDocument()
  })

  it('should render all command items', () => {
    render(<CommandPalette {...defaultProps} />)

    expect(screen.getByText('Quick Capture')).toBeInTheDocument()
    expect(screen.getByText('View All Items')).toBeInTheDocument()
    expect(screen.getByText('Code Snippets')).toBeInTheDocument()
    expect(screen.getByText('Text Notes')).toBeInTheDocument()
    expect(screen.getByText('Images')).toBeInTheDocument()
    expect(screen.getByText('Refine Selection')).toBeInTheDocument()
    expect(screen.getByText('Generate Code')).toBeInTheDocument()
    expect(screen.getByText('Expand Idea')).toBeInTheDocument()
  })

  it('should call onOpenQuickCapture and onClose when Quick Capture is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Quick Capture'))

    expect(defaultProps.onOpenQuickCapture).toHaveBeenCalled()
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onViewAllItems and onClose when View All Items is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('View All Items'))

    expect(defaultProps.onViewAllItems).toHaveBeenCalled()
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onFilterByType with code and onClose when Code Snippets is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Code Snippets'))

    expect(defaultProps.onFilterByType).toHaveBeenCalledWith('code')
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onFilterByType with text and onClose when Text Notes is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Text Notes'))

    expect(defaultProps.onFilterByType).toHaveBeenCalledWith('text')
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onFilterByType with image and onClose when Images is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Images'))

    expect(defaultProps.onFilterByType).toHaveBeenCalledWith('image')
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onOpenAIPreview with refine and onClose when Refine Selection is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Refine Selection'))

    expect(defaultProps.onOpenAIPreview).toHaveBeenCalledWith('refine')
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onOpenAIPreview with transform and onClose when Generate Code is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Generate Code'))

    expect(defaultProps.onOpenAIPreview).toHaveBeenCalledWith('transform')
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should call onOpenAIPreview with expand and onClose when Expand Idea is selected', async () => {
    const user = userEvent.setup()
    render(<CommandPalette {...defaultProps} />)

    await user.click(screen.getByText('Expand Idea'))

    expect(defaultProps.onOpenAIPreview).toHaveBeenCalledWith('expand')
    expect(defaultProps.onClose).toHaveBeenCalled()
  })

  it('should not render when closed', () => {
    render(<CommandPalette {...defaultProps} isOpen={false} />)

    expect(screen.queryByText('Quick Actions')).not.toBeInTheDocument()
  })
})
