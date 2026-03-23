import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { VaultSidebar } from './VaultSidebar'
import { mockVaultItems } from '@/test/mockData'

describe('VaultSidebar', () => {
  const defaultProps = {
    items: [],
    isOpen: true,
    onAddItem: vi.fn(),
    onUpdateItem: vi.fn(),
    onDeleteItem: vi.fn(),
    onClose: vi.fn(),
    selectedItemId: null,
    onSelectItem: vi.fn(),
  }

  it('should render sidebar when open', () => {
    render(<VaultSidebar {...defaultProps} />)
    
    expect(screen.getByText('Shadow Vault')).toBeInTheDocument()
  })

  it('should not display content when closed', () => {
    const { container } = render(<VaultSidebar {...defaultProps} isOpen={false} />)
    
    const sidebar = container.querySelector('.w-0')
    expect(sidebar).toBeInTheDocument()
  })

  it('should show empty state when no items', () => {
    render(<VaultSidebar {...defaultProps} />)
    
    expect(screen.getByText(/No items yet/i)).toBeInTheDocument()
    expect(screen.getByText(/Press ⌘K to capture/i)).toBeInTheDocument()
  })

  it('should render vault items', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} />)
    
    expect(screen.getByText('Test vault item for code snippet')).toBeInTheDocument()
    expect(screen.getByText('Sample prompt for AI generation')).toBeInTheDocument()
    expect(screen.getByText('Regular text note about project ideas')).toBeInTheDocument()
  })

  it('should display item tags', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} />)
    
    expect(screen.getByText('testing')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('ai')).toBeInTheDocument()
    expect(screen.getByText('generation')).toBeInTheDocument()
  })

  it('should call onSelectItem when item is clicked', () => {
    const onSelectItem = vi.fn()
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} onSelectItem={onSelectItem} />)
    
    const item = screen.getByText('Test vault item for code snippet').closest('div')
    fireEvent.click(item!)
    
    expect(onSelectItem).toHaveBeenCalledWith('vault-1')
  })

  it('should call onDeleteItem when delete button is clicked', () => {
    const onDeleteItem = vi.fn()
    const { container } = render(<VaultSidebar {...defaultProps} items={mockVaultItems} onDeleteItem={onDeleteItem} />)
    
    const itemCard = screen.getByText('Test vault item for code snippet').closest('.group')
    fireEvent.mouseEnter(itemCard!)
    
    const deleteButtons = container.querySelectorAll('button')
    const deleteButton = Array.from(deleteButtons).find(btn => 
      btn.querySelector('.text-destructive')
    )
    
    fireEvent.click(deleteButton!)
    
    expect(onDeleteItem).toHaveBeenCalledWith('vault-1')
  })

  it('should highlight selected item', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} selectedItemId="vault-2" />)
    
    const selectedCard = screen.getByText('Sample prompt for AI generation').closest('.border-primary')
    expect(selectedCard).toBeInTheDocument()
    expect(selectedCard).toHaveClass('glow-primary')
  })

  it('should render All and Tags tabs', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} />)
    
    expect(screen.getByRole('tab', { name: 'All' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Tags' })).toBeInTheDocument()
  })

  it('should switch to tags view and show all unique tags', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} />)
    
    const tagsTab = screen.getByRole('tab', { name: 'Tags' })
    fireEvent.click(tagsTab)
    
    expect(screen.getByText('testing')).toBeInTheDocument()
    expect(screen.getByText('typescript')).toBeInTheDocument()
    expect(screen.getByText('ai')).toBeInTheDocument()
  })

  it('should display correct item counts for tags', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} />)
    
    const tagsTab = screen.getByRole('tab', { name: 'Tags' })
    fireEvent.click(tagsTab)
    
    const badges = screen.getAllByText('1')
    expect(badges.length).toBeGreaterThan(0)
  })

  it('should filter items by tag when tag is selected', () => {
    render(<VaultSidebar {...defaultProps} items={mockVaultItems} />)
    
    const tagsTab = screen.getByRole('tab', { name: 'Tags' })
    fireEvent.click(tagsTab)
    
    const testingTagButton = screen.getByText('testing').closest('button')
    fireEvent.click(testingTagButton!)
    
    expect(screen.getByText('Test vault item for code snippet')).toBeInTheDocument()
    expect(screen.queryByText('Sample prompt for AI generation')).not.toBeInTheDocument()
  })
})
