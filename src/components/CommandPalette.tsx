import { useState, useEffect } from 'react'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { 
  Lightning, 
  Archive, 
  Code, 
  Image as ImageIcon, 
  FileText,
  Sparkle
} from '@phosphor-icons/react'

interface CommandPaletteProps {
  isOpen: boolean
  onClose: () => void
  onOpenQuickCapture: () => void
  onViewAllItems: () => void
  onFilterByType: (type: 'code' | 'text' | 'image') => void
  onOpenAIPreview: (mode: 'refine' | 'expand' | 'transform') => void
}

export function CommandPalette({ isOpen, onClose, onOpenQuickCapture, onViewAllItems, onFilterByType, onOpenAIPreview }: CommandPaletteProps) {
  const [search, setSearch] = useState('')

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onOpenQuickCapture()
      }
      if (e.key === '/' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        onClose()
      }
    }

    document.addEventListener('keydown', down)
    return () => document.removeEventListener('keydown', down)
  }, [onClose, onOpenQuickCapture])

  const handleSelect = (callback: () => void) => {
    callback()
    onClose()
  }

  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <Command className="rounded-lg border border-primary/30 shadow-md bg-card">
        <CommandInput 
          placeholder="Search commands or capture ideas..." 
          value={search}
          onValueChange={setSearch}
          className="border-b border-border"
        />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Quick Actions">
            <CommandItem
              onSelect={() => handleSelect(onOpenQuickCapture)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Lightning size={16} weight="duotone" className="text-primary" />
              <span>Quick Capture</span>
              <span className="ml-auto text-xs text-muted-foreground">⌘K</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="Vault">
            <CommandItem
              onSelect={() => handleSelect(onViewAllItems)}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Archive size={16} weight="duotone" className="text-secondary" />
              <span>View All Items</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => onFilterByType('code'))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Code size={16} weight="duotone" className="text-secondary" />
              <span>Code Snippets</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => onFilterByType('text'))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <FileText size={16} weight="duotone" className="text-secondary" />
              <span>Text Notes</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => onFilterByType('image'))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <ImageIcon size={16} weight="duotone" className="text-accent" />
              <span>Images</span>
            </CommandItem>
          </CommandGroup>

          <CommandSeparator />

          <CommandGroup heading="AI Co-pilot">
            <CommandItem
              onSelect={() => handleSelect(() => onOpenAIPreview('refine'))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sparkle size={16} weight="duotone" className="text-primary" />
              <span>Refine Selection</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => onOpenAIPreview('transform'))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sparkle size={16} weight="duotone" className="text-primary" />
              <span>Generate Code</span>
            </CommandItem>
            <CommandItem
              onSelect={() => handleSelect(() => onOpenAIPreview('expand'))}
              className="flex items-center gap-2 cursor-pointer"
            >
              <Sparkle size={16} weight="duotone" className="text-primary" />
              <span>Expand Idea</span>
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </Command>
    </CommandDialog>
  )
}
