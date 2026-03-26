import { TimelineNode } from '@/lib/types'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { format } from 'date-fns'
import { 
  GitBranch, 
  GitCommit, 
  Archive, 
  Square, 
  Lightning,
  Export,
  ArrowClockwise
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface TimelineViewProps {
  isOpen: boolean
  onClose: () => void
  nodes: TimelineNode[]
  onResurrect: (snapshot: any) => void
}

export function TimelineView({ isOpen, onClose, nodes, onResurrect }: TimelineViewProps) {
  const getNodeIcon = (type: TimelineNode['type']) => {
    switch (type) {
      case 'vault-item':
        return <Archive size={16} weight="duotone" className="text-primary" />
      case 'canvas-change':
        return <Square size={16} weight="duotone" className="text-secondary" />
      case 'agent-spawn':
        return <Lightning size={16} weight="duotone" className="text-accent" />
      case 'export':
        return <Export size={16} weight="duotone" className="text-neural-indigo" />
      default:
        return <GitCommit size={16} weight="duotone" />
    }
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[400px] border-l border-border bg-card p-0 sm:w-[500px]">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-border text-left">
            <SheetTitle className="flex items-center gap-2">
              <GitBranch size={20} weight="duotone" className="text-primary" />
              Timeline Rebellion
            </SheetTitle>
            <SheetDescription>
              Explore and resurrect previous versions of your forge.
            </SheetDescription>
          </SheetHeader>

          <ScrollArea className="flex-1">
            <div className="p-6 relative">
              {/* Timeline vertical line */}
              <div className="absolute left-[33px] top-6 bottom-6 w-0.5 bg-border z-0" />

              <div className="space-y-8">
                {nodes.length === 0 ? (
                  <div className="text-center py-12">
                    <p className="text-sm text-muted-foreground">
                      No snapshots recorded yet. Start making changes!
                    </p>
                  </div>
                ) : (
                  nodes.map((node) => (
                    <div key={node.id} className="relative z-10 flex gap-4 group">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted border border-border flex items-center justify-center group-hover:border-primary/50 transition-colors">
                        {getNodeIcon(node.type)}
                      </div>
                      
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono text-muted-foreground">
                            {format(node.timestamp, 'MMM d, HH:mm:ss')}
                          </span>
                          <span className="text-[10px] uppercase tracking-widest text-muted-foreground/50 font-bold">
                            #{node.id.split('-')[1]}
                          </span>
                        </div>
                        
                        <div className="p-3 rounded-md bg-muted/30 border border-border hover:border-primary/30 transition-all cursor-default group-hover:bg-muted/50">
                          <p className="text-sm font-medium mb-1">
                            {node.description}
                          </p>
                          <p className="text-xs text-muted-foreground mb-3">
                            {node.type === 'canvas-change' 
                              ? `${node.snapshot.canvasNodes?.length || 0} nodes, ${node.snapshot.connections?.length || 0} connections`
                              : `${node.snapshot.vaultItems?.length || 0} vault items`
                            }
                          </p>
                          
                          <Button 
                            size="sm" 
                            variant="secondary" 
                            className="w-full text-xs h-8 glow-hover"
                            onClick={() => onResurrect(node.snapshot)}
                          >
                            <ArrowClockwise size={12} className="mr-1" />
                            Resurrect
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
