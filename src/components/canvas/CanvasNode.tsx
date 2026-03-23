import { CanvasNode } from '@/lib/types'
import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash, DotsSix } from '@phosphor-icons/react'
import { cn, countWords } from '@/lib/utils'

interface CanvasNodeComponentProps {
  node: CanvasNode
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<CanvasNode>) => void
  onDelete: () => void
}

export function CanvasNodeComponent({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
}: CanvasNodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
    
    e.stopPropagation()
    onSelect()
    setIsDragging(true)
    setDragStart({
      x: e.clientX - node.position.x,
      y: e.clientY - node.position.y,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        onUpdate({
          position: {
            x: e.clientX - dragStart.x,
            y: e.clientY - dragStart.y,
          },
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, dragStart, onUpdate])

  return (
    <div
      ref={nodeRef}
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        minHeight: node.size.height,
      }}
    >
      <Card
        className={cn(
          'p-4 cursor-move transition-all border-2 group hover:shadow-lg',
          isSelected ? 'border-primary glow-primary' : 'border-border',
          isDragging && 'opacity-80 shadow-2xl'
        )}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-1 text-muted-foreground">
            <DotsSix size={16} weight="duotone" />
            <span className="text-xs uppercase tracking-wide font-mono">
              {node.type}
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash size={14} className="text-destructive" />
          </Button>
        </div>

        <Textarea
          value={node.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          onClick={(e) => e.stopPropagation()}
          className={cn(
            'min-h-[100px] resize-none border-none bg-transparent p-0 focus-visible:ring-0',
            node.type === 'code' && 'font-mono text-sm'
          )}
          placeholder={
            node.type === 'code'
              ? '// Write code...'
              : node.type === 'text'
              ? 'Type your idea...'
              : 'Add content...'
          }
        />

        {node.content.trim().length > 0 && (
          <div data-testid="node-word-count" className="flex items-center justify-end gap-2 mt-2 pt-2 border-t border-border/50 text-[10px] text-muted-foreground font-mono">
            <span>{countWords(node.content)} {countWords(node.content) === 1 ? 'word' : 'words'}</span>
            <span>·</span>
            <span>{node.content.length} chars</span>
          </div>
        )}
      </Card>
    </div>
  )
}
