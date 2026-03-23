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
  Clock
} from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { format } from 'date-fns'

interface VaultSidebarProps {
  items: VaultItem[]
  isOpen: boolean
  onAddItem: (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void
  onUpdateItem: (id: string, updates: Partial<VaultItem>) => void
  onDeleteItem: (id: string) => void
  onClose: () => void
  selectedItemId?: string | null
  onSelectItem: (id: string) => void
}

export function VaultSidebar({ items, isOpen, onDeleteItem, selectedItemId, onSelectItem }: VaultSidebarProps) {
  const [activeTab, setActiveTab] = useState('all')
  const [selectedTags, setSelectedTags] = useState<string[]>([])

  const allTags = Array.from(new Set(items.flatMap((item) => item.tags)))

  const filteredItems = items.filter((item) => {
    if (activeTab === 'all') return true
    if (activeTab === 'tags' && selectedTags.length > 0) {
      return selectedTags.some((tag) => item.tags.includes(tag))
    }
    return true
  })

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
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="mx-4 mt-4">
            <TabsTrigger value="all" className="flex-1">All</TabsTrigger>
            <TabsTrigger value="tags" className="flex-1">Tags</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="flex-1 mt-0 overflow-hidden">
            <ScrollArea className="h-full px-4">
              <div className="space-y-3 py-4">
                {filteredItems.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No items yet. Press ⌘K to capture.
                    </p>
                  </div>
                ) : (
                  filteredItems.map((item) => (
                    <Card
                      key={item.id}
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

                      <p className="text-sm line-clamp-3 mb-3">
                        {item.content}
                      </p>

                      {item.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {item.tags.map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="text-xs px-2 py-0.5"
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
                  allTags.map((tag) => {
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
                          setActiveTab('all')
                        }}
                        className={cn(
                          'w-full flex items-center justify-between p-3 rounded-md border transition-all',
                          isSelected
                            ? 'border-primary bg-primary/10 glow-primary'
                            : 'border-border hover:border-primary/50'
                        )}
                      >
                        <span className="text-sm font-medium">{tag}</span>
                        <Badge variant="outline" className="text-xs">
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
