import { VaultItem } from '@/lib/types'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Code, 
  Image as ImageIcon, 
  FileText, 
  Lightning, 
  Trash,
  Tag,
  Clock,
  MagnifyingGlass,
  XCircle
} from '@phosphor-icons/react'
import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'
import { Markdown } from '@/components/Markdown'
import { Input } from '@/components/ui/input'

interface VaultSidebarProps {
  items: VaultItem[]
  isOpen: boolean
  onAddItem: (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void
  onUpdateItem: (id: string, updates: Partial<VaultItem>) => void
  onDeleteItem: (id: string) => void
  onClose: () => void
  selectedItemId?: string | null
  onSelectItem: (id: string) => void
  typeFilter?: VaultItem['type'] | null
  onClearTypeFilter?: () => void
}

export function VaultSidebar({ items, isOpen, onDeleteItem, selectedItemId, onSelectItem, typeFilter, onClearTypeFilter }: VaultSidebarProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [searchQuery, setSearchQuery] = useState('')

  const allTags = Array.from(new Set(items.flatMap((item) => item.tags)))

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // 1. Type Filter (from header)
      if (typeFilter && item.type !== typeFilter) return false
      
      // 2. Search Query
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const contentMatch = item.content.toLowerCase().includes(query)
        const tagMatch = item.tags.some(tag => tag.toLowerCase().includes(query))
        if (!contentMatch && !tagMatch) return false
      }
      
      // 3. Tag Filter (AND logic)
      if (selectedTags.length > 0) {
        return selectedTags.every((tag) => item.tags.includes(tag))
      }
      
      return true
    })
  }, [items, typeFilter, searchQuery, selectedTags])

  const getItemIcon = (type: VaultItem['type']) => {
    switch (type) {
      case 'code':
        return <Code size={16} weight="duotone" className="text-secondary" />
      case 'image':
        return <ImageIcon size={16} weight="duotone" className="text-accent" />
      case 'prompt':
        return <Lightning size={16} weight="duotone" className="text-primary" />
      default:
        return <FileText size={16} weight="duotone" className="text-muted-foreground" />
    }
  }

  return (
    <aside
      data-testid="vault-sidebar"
      className={cn(
        'border-r border-border bg-card transition-all duration-300 shrink-0',
        isOpen ? 'w-80' : 'w-0 overflow-hidden'
      )}
    >
      <div className="h-full flex flex-col">
        <div className="p-4 border-b border-border">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground flex items-center gap-2">
            <Tag size={16} weight="duotone" />
            Shadow Vault
          </h2>
          {typeFilter && (
            <div className="mt-2 flex items-center gap-2">
              <Badge variant="secondary" className="text-xs">
                {typeFilter}
              </Badge>
              {onClearTypeFilter && (
                <button
                  onClick={onClearTypeFilter}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors"
                >
                  Clear filter
                </button>
              )}
            </div>
          )}
        </div>

        <div className="p-4 space-y-4">
          <div className="relative group">
            <MagnifyingGlass 
              size={16} 
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors" 
            />
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search ideas or tags..."
              className="pl-10 bg-muted/30 border-border focus-visible:ring-primary h-9 text-xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                <XCircle size={14} weight="fill" />
              </button>
            )}
          </div>

          {selectedTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 animate-in fade-in slide-in-from-top-1 duration-200">
              {selectedTags.map(tag => (
                <Badge 
                  key={tag} 
                  variant="secondary" 
                  className="bg-primary/20 border-primary/30 text-primary flex items-center gap-1 pr-1 pl-2 py-0.5"
                >
                  {tag}
                  <button 
                    onClick={() => setSelectedTags(prev => prev.filter(t => t !== tag))}
                    className="hover:text-foreground p-0.5 rounded-full hover:bg-primary/20"
                  >
                    <XCircle size={12} weight="fill" />
                  </button>
                </Badge>
              ))}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSelectedTags([])}
                className="h-6 text-[10px] text-muted-foreground hover:text-destructive"
              >
                Clear all
              </Button>
            </div>
          )}
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col min-h-0">
          <TabsList className="mx-4">
            <TabsTrigger value="all" className="flex-1 text-xs h-8">Items</TabsTrigger>
            <TabsTrigger value="tags" className="flex-1 text-xs h-8">Browse Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3 py-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      {searchQuery || selectedTags.length > 0 ? 'No matching items found.' : 'No items yet. Press ⌘K to capture.'}
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      data-testid="vault-item"
                      onClick={() => onSelectItem(item.id)}
                      className={cn(
                        'p-4 border-2 transition-all cursor-pointer group',
                        selectedItemId === item.id 
                          ? 'border-primary glow-primary bg-primary/5' 
                          : 'border-border hover:border-primary/50 glow-hover'
                      )}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div className="flex items-center gap-2">
                          {getItemIcon(item.type)}
                          <span className="text-xs text-muted-foreground flex items-center gap-1">
                            <Clock size={12} />
                            {format(item.createdAt, 'MMM d, HH:mm')}
                          </span>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={(e) => {
                            e.stopPropagation()
                            onDeleteItem(item.id)
                          }}
                        >
                          <Trash size={14} className="text-destructive" />
                        </Button>
                      </div>

                      <Markdown content={item.content} preview className="text-sm mb-3" />

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation()
                                setSelectedTags(prev => 
                                  prev.includes(tag) ? prev : [...prev, tag]
                                )
                              }}
                              className={cn(
                                "text-[10px] px-1.5 py-0 border border-transparent transition-colors",
                                selectedTags.includes(tag) 
                                  ? "bg-primary/20 border-primary/30 text-primary" 
                                  : "bg-muted/50 hover:border-primary/30"
                              )}
                            >
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="tags" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="space-y-2 py-4">
                {allTags.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No tags yet.
                    </p>
                  </div>
                ) : (
                  allTags
                    .sort((a, b) => a.localeCompare(b))
                    .map((tag) => {
                      const count = items.filter((item) => item.tags.includes(tag)).length
                      const isSelected = selectedTags.includes(tag)

                      return (
                        <button
                          key={tag}
                          onClick={() => {
                            setSelectedTags((prev) =>
                              isSelected
                                ? prev.filter((t) => t !== tag)
                                : [...prev, tag]
                            )
                          }}
                          className={cn(
                            'w-full flex items-center justify-between px-3 py-2 rounded-md border transition-all group/tag',
                            isSelected
                              ? 'border-primary bg-primary/10 glow-primary'
                              : 'border-border hover:border-primary/50 bg-muted/10'
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <Tag 
                              size={14} 
                              weight={isSelected ? "fill" : "duotone"} 
                              className={isSelected ? "text-primary" : "text-muted-foreground group-hover/tag:text-primary"} 
                            />
                            <span className={cn(
                              "text-sm font-medium transition-colors",
                              isSelected ? "text-primary" : "group-hover/tag:text-primary"
                            )}>
                              {tag}
                            </span>
                          </div>
                          <Badge variant="outline" className={cn(
                            "text-[10px] h-5 transition-colors",
                            isSelected ? "border-primary/50 bg-primary/20 text-primary" : ""
                          )}>
                            {count}
                          </Badge>
                        </button>
                      )
                    })
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </aside>
  )
}
