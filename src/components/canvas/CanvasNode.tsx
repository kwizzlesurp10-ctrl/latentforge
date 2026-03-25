import { CanvasNode } from '@/lib/types'
import { useState, useRef, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Trash, DotsSix, ArrowsOutSimple } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'

interface CanvasNodeComponentProps {
  node: CanvasNode
  isSelected: boolean
  onSelect: () => void
  onUpdate: (updates: Partial<CanvasNode>) => void
  onDelete: () => void
  zoom: number
}

export function CanvasNodeComponent({
  node,
  isSelected,
  onSelect,
  onUpdate,
  onDelete,
  zoom,
}: CanvasNodeComponentProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 })
  const [resizeStart, setResizeStart] = useState({ width: 0, height: 0, x: 0, y: 0 })
  const nodeRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if ((e.target as HTMLElement).tagName === 'TEXTAREA') return
    if ((e.target as HTMLElement).closest('.resize-handle')) return
    
    e.stopPropagation()
    onSelect()
    setIsDragging(true)
    const scale = 1 / zoom
    setDragStart({
      x: e.clientX * scale - node.position.x,
      y: e.clientY * scale - node.position.y,
    })
  }

  const handleResizeStart = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsResizing(true)
    const scale = 1 / zoom
    setResizeStart({
      width: node.size.width,
      height: node.size.height,
      x: e.clientX * scale,
      y: e.clientY * scale,
    })
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const scale = 1 / zoom
      
      if (isDragging) {
        onUpdate({
          position: {
            x: e.clientX * scale - dragStart.x,
            y: e.clientY * scale - dragStart.y,
          },
        })
      }
      
      if (isResizing) {
        const deltaX = e.clientX * scale - resizeStart.x
        const deltaY = e.clientY * scale - resizeStart.y
        
        onUpdate({
          size: {
            width: Math.max(200, resizeStart.width + deltaX),
            height: Math.max(100, resizeStart.height + deltaY),
          },
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
      setIsResizing(false)
    }

    if (isDragging || isResizing) {
      window.addEventListener('mousemove', handleMouseMove)
      window.addEventListener('mouseup', handleMouseUp)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [isDragging, isResizing, dragStart, resizeStart, onUpdate, zoom])

  return (
    <motion.div
      ref={nodeRef}
      className="absolute"
      style={{
        left: node.position.x,
        top: node.position.y,
        width: node.size.width,
        minHeight: node.size.height,
      }}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ 
        opacity: 1, 
        scale: 1,
      }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        className={cn(
          'p-4 cursor-move transition-all border-2 group hover:shadow-lg relative',
          isSelected ? 'border-primary glow-primary' : 'border-border',
          isDragging && 'opacity-80 shadow-2xl scale-105',
          isResizing && 'opacity-90'
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
            className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
            onClick={(e) => {
              e.stopPropagation()
              onDelete()
            }}
          >
            <Trash size={14} />
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

        {isSelected && (
          <motion.div
            className="resize-handle absolute bottom-0 right-0 w-6 h-6 cursor-nwse-resize opacity-0 group-hover:opacity-100 transition-opacity"
            onMouseDown={handleResizeStart}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <ArrowsOutSimple 
              size={16} 
              weight="bold" 
              className="absolute bottom-1 right-1 text-primary"
            />
          </motion.div>
        )}
      </Card>
    </motion.div>
  )
}
