import { CanvasNode, Connection } from '@/lib/types'
import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, TextT, Code, Image as ImageIcon } from '@phosphor-icons/react'
import { CanvasNodeComponent } from './CanvasNode'
import { cn } from '@/lib/utils'

interface ForgeCanvasProps {
  nodes: CanvasNode[]
  connections: Connection[]
  onAddNode: (node: Omit<CanvasNode, 'id'>) => CanvasNode
  onUpdateNode: (id: string, updates: Partial<CanvasNode>) => void
  onDeleteNode: (id: string) => void
  onAddConnection: (source: string, target: string) => void
}

export function ForgeCanvas({
  nodes,
  connections,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
}: ForgeCanvasProps) {
  const [pan, setPan] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)

  const handleWheel = (e: React.WheelEvent) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault()
      const delta = e.deltaY * -0.001
      const newZoom = Math.min(Math.max(zoom + delta, 0.25), 2)
      setZoom(newZoom)
    } else {
      setPan({
        x: pan.x - e.deltaX,
        y: pan.y - e.deltaY,
      })
    }
  }

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === canvasRef.current || (e.target as HTMLElement).closest('.canvas-background')) {
      setIsPanning(true)
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y })
      setSelectedNodeId(null)
    }
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      })
    }
  }

  const handleMouseUp = () => {
    setIsPanning(false)
  }

  const addNode = (type: CanvasNode['type']) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    const centerX = canvasRect ? canvasRect.width / 2 : 400
    const centerY = canvasRect ? canvasRect.height / 2 : 300

    const newNode = onAddNode({
      type,
      content: type === 'code' ? '// Start coding...' : type === 'text' ? 'Type your idea...' : '',
      position: {
        x: (centerX - pan.x) / zoom - 150,
        y: (centerY - pan.y) / zoom - 75,
      },
      size: { width: 300, height: 150 },
      connections: [],
    })

    setSelectedNodeId(newNode.id)
  }

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault()
        setZoom(1)
        setPan({ x: 0, y: 0 })
      }
      if (e.key === 'Delete' && selectedNodeId) {
        onDeleteNode(selectedNodeId)
        setSelectedNodeId(null)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedNodeId, onDeleteNode])

  return (
    <div className="flex-1 flex flex-col bg-background relative overflow-hidden">
      <div className="absolute top-4 left-4 z-10 flex gap-2">
        <Button
          size="sm"
          variant="secondary"
          onClick={() => addNode('text')}
          className="glow-hover shadow-lg"
        >
          <TextT size={16} weight="duotone" className="mr-1" />
          Text
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => addNode('code')}
          className="glow-hover shadow-lg"
        >
          <Code size={16} weight="duotone" className="mr-1" />
          Code
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onClick={() => addNode('image')}
          className="glow-hover shadow-lg"
        >
          <ImageIcon size={16} weight="duotone" className="mr-1" />
          Image
        </Button>
      </div>

      <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 text-sm shadow-lg">
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setZoom(Math.max(zoom - 0.1, 0.25))}
        >
          <span className="text-lg">−</span>
        </Button>
        <span className="font-mono text-xs w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <Button
          size="icon"
          variant="ghost"
          className="h-6 w-6"
          onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
        >
          <span className="text-lg">+</span>
        </Button>
      </div>

      <div
        ref={canvasRef}
        className={cn(
          'flex-1 relative overflow-hidden',
          isPanning ? 'cursor-grabbing' : 'cursor-grab'
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <div
          className="canvas-background absolute inset-0"
          style={{
            backgroundImage: `
              radial-gradient(circle, oklch(0.25 0.05 270 / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            backgroundPosition: `${pan.x}px ${pan.y}px`,
          }}
        />

        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          {connections.map((conn) => {
            const sourceNode = nodes.find((n) => n.id === conn.source)
            const targetNode = nodes.find((n) => n.id === conn.target)

            if (!sourceNode || !targetNode) return null

            const x1 = (sourceNode.position.x + sourceNode.size.width / 2) * zoom + pan.x
            const y1 = (sourceNode.position.y + sourceNode.size.height / 2) * zoom + pan.y
            const x2 = (targetNode.position.x + targetNode.size.width / 2) * zoom + pan.x
            const y2 = (targetNode.position.y + targetNode.size.height / 2) * zoom + pan.y

            return (
              <line
                key={conn.id}
                x1={x1}
                y1={y1}
                x2={x2}
                y2={y2}
                stroke="oklch(0.75 0.15 195)"
                strokeWidth={2}
                opacity={0.5}
              />
            )
          })}
        </svg>

        <div
          className="absolute"
          style={{
            transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            zIndex: 2,
          }}
        >
          {nodes.map((node) => (
            <CanvasNodeComponent
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              onSelect={() => setSelectedNodeId(node.id)}
              onUpdate={(updates) => onUpdateNode(node.id, updates)}
              onDelete={() => onDeleteNode(node.id)}
            />
          ))}
        </div>

        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className="text-center">
              <Plus size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-sm">
                Click a button above to add your first node
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Scroll to pan • Cmd+Scroll to zoom • Cmd+0 to reset
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
