import { CanvasNode, Connection } from '@/lib/types'
import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Plus, TextT, Code, Image as ImageIcon, MapTrifold, CornersOut, Hand, Selection, Target } from '@phosphor-icons/react'
import { CanvasNodeComponent } from './CanvasNode'
import { cn } from '@/lib/utils'
import { motion, AnimatePresence, useSpring, useMotionValue } from 'framer-motion'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { toast } from 'sonner'

interface ForgeCanvasProps {
  nodes: CanvasNode[]
  connections: Connection[]
  onAddNode: (node: Omit<CanvasNode, 'id'>) => CanvasNode
  onUpdateNode: (id: string, updates: Partial<CanvasNode>) => void
  onDeleteNode: (id: string) => void
  onAddConnection: (source: string, target: string) => void
  selectedNodeId?: string | null
  onSelectNode: (id: string | null) => void
  zoomSpeed?: number
  showGrid?: boolean
}

export function ForgeCanvas({
  nodes,
  connections,
  onAddNode,
  onUpdateNode,
  onDeleteNode,
  selectedNodeId,
  onSelectNode,
  zoomSpeed = 1,
  showGrid = true,
}: ForgeCanvasProps) {
  const panX = useMotionValue(0)
  const panY = useMotionValue(0)
  const [zoom, setZoom] = useState(1)
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [isSelecting, setIsSelecting] = useState(false)
  const [selectionStart, setSelectionStart] = useState({ x: 0, y: 0 })
  const [selectionEnd, setSelectionEnd] = useState({ x: 0, y: 0 })
  const [selectedNodes, setSelectedNodes] = useState<Set<string>>(new Set())
  const [showMinimap, setShowMinimap] = useState(false)
  const [isDraggingCanvas, setIsDraggingCanvas] = useState(false)
  const [interactionMode, setInteractionMode] = useState<'pan' | 'select'>('pan')
  const canvasRef = useRef<HTMLDivElement>(null)
  const minimapRef = useRef<HTMLCanvasElement>(null)
  
  const smoothZoom = useSpring(zoom, { stiffness: 300, damping: 30 })

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault()
    e.stopPropagation()
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const mouseX = e.clientX - rect.left
    const mouseY = e.clientY - rect.top
    
    const delta = e.deltaY * -0.003 * zoomSpeed
    const newZoom = Math.min(Math.max(zoom + delta, 0.1), 3)
    
    const zoomFactor = newZoom / zoom
    
    const currentPanX = panX.get()
    const currentPanY = panY.get()
    
    panX.set(mouseX - (mouseX - currentPanX) * zoomFactor)
    panY.set(mouseY - (mouseY - currentPanY) * zoomFactor)
    
    setZoom(newZoom)
  }, [panX, panY, zoom, zoomSpeed])

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    const target = e.target as HTMLElement
    
    if (target === canvasRef.current || target.closest('.canvas-background')) {
      if (interactionMode === 'select' || e.shiftKey) {
        setIsSelecting(true)
        const rect = canvasRef.current?.getBoundingClientRect()
        if (rect) {
          setSelectionStart({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
          setSelectionEnd({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
          })
        }
      } else {
        setIsDraggingCanvas(true)
        setIsPanning(true)
        setPanStart({ x: e.clientX - panX.get(), y: e.clientY - panY.get() })
        onSelectNode(null)
        setSelectedNodes(new Set())
      }
    }
  }, [panX, panY, interactionMode, onSelectNode])

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (isPanning && isDraggingCanvas) {
      panX.set(e.clientX - panStart.x)
      panY.set(e.clientY - panStart.y)
    } else if (isSelecting) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        setSelectionEnd({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top,
        })
      }
    }
  }, [isPanning, isDraggingCanvas, isSelecting, panStart, panX, panY])

  const handleMouseUp = useCallback(() => {
    if (isSelecting) {
      const rect = canvasRef.current?.getBoundingClientRect()
      if (rect) {
        const minX = Math.min(selectionStart.x, selectionEnd.x)
        const maxX = Math.max(selectionStart.x, selectionEnd.x)
        const minY = Math.min(selectionStart.y, selectionEnd.y)
        const maxY = Math.max(selectionStart.y, selectionEnd.y)
        
        const selected = new Set<string>()
        const currentPanX = panX.get()
        const currentPanY = panY.get()
        
        nodes.forEach(node => {
          const nodeScreenX = node.position.x * zoom + currentPanX
          const nodeScreenY = node.position.y * zoom + currentPanY
          const nodeScreenW = node.size.width * zoom
          const nodeScreenH = node.size.height * zoom
          
          if (
            nodeScreenX + nodeScreenW > minX &&
            nodeScreenX < maxX &&
            nodeScreenY + nodeScreenH > minY &&
            nodeScreenY < maxY
          ) {
            selected.add(node.id)
          }
        })
        
        setSelectedNodes(selected)
        if (selected.size > 0) {
          toast.success(`Selected ${selected.size} node${selected.size > 1 ? 's' : ''}`)
        }
      }
      setIsSelecting(false)
    }
    
    setIsPanning(false)
    setIsDraggingCanvas(false)
  }, [isSelecting, selectionStart, selectionEnd, nodes, zoom, panX, panY])

  const addNode = useCallback((type: CanvasNode['type']) => {
    const canvasRect = canvasRef.current?.getBoundingClientRect()
    const centerX = canvasRect ? canvasRect.width / 2 : 400
    const centerY = canvasRect ? canvasRect.height / 2 : 300

    const currentPanX = panX.get()
    const currentPanY = panY.get()

    const newNode = onAddNode({
      type,
      content: type === 'code' ? '// Start coding...' : type === 'text' ? 'Type your idea...' : '',
      position: {
        x: (centerX - currentPanX) / zoom - 150,
        y: (centerY - currentPanY) / zoom - 75,
      },
      size: { width: 300, height: 150 },
      connections: [],
    })

    onSelectNode(newNode.id)
    toast.success(`${type.charAt(0).toUpperCase() + type.slice(1)} node added`)
  }, [onAddNode, onSelectNode, panX, panY, zoom])

  const centerCanvas = useCallback(() => {
    if (nodes.length === 0) {
      panX.set(0)
      panY.set(0)
      setZoom(1)
      return
    }
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxX = Math.max(maxX, node.position.x + node.size.width)
      maxY = Math.max(maxY, node.position.y + node.size.height)
    })
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const centerX = (minX + maxX) / 2
    const centerY = (minY + maxY) / 2
    const width = maxX - minX
    const height = maxY - minY
    
    const zoomX = (rect.width * 0.8) / width
    const zoomY = (rect.height * 0.8) / height
    const newZoom = Math.min(Math.max(Math.min(zoomX, zoomY), 0.1), 2)
    
    panX.set(rect.width / 2 - centerX * newZoom)
    panY.set(rect.height / 2 - centerY * newZoom)
    setZoom(newZoom)
    toast.success('Canvas centered')
  }, [nodes, panX, panY])

  const focusNode = useCallback((nodeId: string) => {
    const node = nodes.find(n => n.id === nodeId)
    if (!node) return
    
    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return
    
    const nodeCenterX = node.position.x + node.size.width / 2
    const nodeCenterY = node.position.y + node.size.height / 2
    
    panX.set(rect.width / 2 - nodeCenterX * zoom)
    panY.set(rect.height / 2 - nodeCenterY * zoom)
    
    onSelectNode(nodeId)
  }, [nodes, zoom, panX, panY, onSelectNode])

  const drawMinimap = useCallback(() => {
    const canvas = minimapRef.current
    if (!canvas || nodes.length === 0) return
    
    const ctx = canvas.getContext('2d')
    if (!ctx) return
    
    const width = 200
    const height = 150
    canvas.width = width
    canvas.height = height
    
    ctx.fillStyle = 'oklch(0.18 0.02 270)'
    ctx.fillRect(0, 0, width, height)
    
    let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity
    
    nodes.forEach(node => {
      minX = Math.min(minX, node.position.x)
      minY = Math.min(minY, node.position.y)
      maxX = Math.max(maxX, node.position.x + node.size.width)
      maxY = Math.max(maxY, node.position.y + node.size.height)
    })
    
    const scaleX = width / (maxX - minX + 100)
    const scaleY = height / (maxY - minY + 100)
    const scale = Math.min(scaleX, scaleY)
    
    nodes.forEach(node => {
      const x = (node.position.x - minX + 50) * scale
      const y = (node.position.y - minY + 50) * scale
      const w = node.size.width * scale
      const h = node.size.height * scale
      
      ctx.fillStyle = selectedNodeId === node.id ? 'oklch(0.65 0.28 330)' : 'oklch(0.25 0.05 270)'
      ctx.fillRect(x, y, w, h)
      
      ctx.strokeStyle = 'oklch(0.65 0.28 330 / 0.5)'
      ctx.lineWidth = 1
      ctx.strokeRect(x, y, w, h)
    })
    
    const currentPanX = panX.get()
    const currentPanY = panY.get()
    const rect = canvasRef.current?.getBoundingClientRect()
    if (rect) {
      const viewX = ((-currentPanX / zoom) - minX + 50) * scale
      const viewY = ((-currentPanY / zoom) - minY + 50) * scale
      const viewW = (rect.width / zoom) * scale
      const viewH = (rect.height / zoom) * scale
      
      ctx.strokeStyle = 'oklch(0.75 0.15 195)'
      ctx.lineWidth = 2
      ctx.strokeRect(viewX, viewY, viewW, viewH)
    }
  }, [nodes, selectedNodeId, panX, panY, zoom])

  useEffect(() => {
    if (showMinimap) {
      const interval = setInterval(drawMinimap, 100)
      return () => clearInterval(interval)
    }
  }, [showMinimap, drawMinimap])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '0') {
        e.preventDefault()
        centerCanvas()
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'm') {
        e.preventDefault()
        setShowMinimap(prev => !prev)
        toast.info(`Minimap ${!showMinimap ? 'enabled' : 'disabled'}`)
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === '=') {
        e.preventDefault()
        setZoom(prev => Math.min(prev + 0.1, 3))
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === '-') {
        e.preventDefault()
        setZoom(prev => Math.max(prev - 0.1, 0.1))
      }
      
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId) {
          e.preventDefault()
          onDeleteNode(selectedNodeId)
          onSelectNode(null)
          toast.success('Node deleted')
        } else if (selectedNodes.size > 0) {
          e.preventDefault()
          selectedNodes.forEach(id => onDeleteNode(id))
          setSelectedNodes(new Set())
          toast.success(`${selectedNodes.size} nodes deleted`)
        }
      }
      
      if (e.key === 'Escape') {
        onSelectNode(null)
        setSelectedNodes(new Set())
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'a') {
        e.preventDefault()
        const allNodeIds = new Set(nodes.map(n => n.id))
        setSelectedNodes(allNodeIds)
        toast.success(`Selected all ${allNodeIds.size} nodes`)
      }
      
      if (e.key === 'v' && !e.metaKey && !e.ctrlKey) {
        setInteractionMode(prev => {
          const newMode = prev === 'pan' ? 'select' : 'pan'
          toast.info(`${newMode === 'pan' ? 'Pan' : 'Select'} mode activated`)
          return newMode
        })
      }
      
      if (e.key === ' ' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault()
        setInteractionMode('pan')
      }
    }
    
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === ' ') {
        setInteractionMode('pan')
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [selectedNodeId, selectedNodes, onDeleteNode, onSelectNode, centerCanvas, nodes, showMinimap])

  return (
    <div data-testid="forge-canvas" className="flex-1 flex flex-col bg-background relative overflow-hidden">
      <motion.div 
        className="absolute top-4 left-4 z-10 flex gap-2"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addNode('text')}
              className="glow-hover shadow-lg"
            >
              <TextT size={16} weight="duotone" className="mr-1" />
              Text
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add text node</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addNode('code')}
              className="glow-hover shadow-lg"
            >
              <Code size={16} weight="duotone" className="mr-1" />
              Code
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add code node</TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => addNode('image')}
              className="glow-hover shadow-lg"
            >
              <ImageIcon size={16} weight="duotone" className="mr-1" />
              Image
            </Button>
          </TooltipTrigger>
          <TooltipContent>Add image node</TooltipContent>
        </Tooltip>
      </motion.div>

      <motion.div 
        className="absolute bottom-4 left-4 z-10 flex items-center gap-2"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => {
                const newMode = interactionMode === 'pan' ? 'select' : 'pan'
                setInteractionMode(newMode)
                toast.info(`${newMode === 'pan' ? 'Pan' : 'Select'} mode`)
              }}
              className={cn("shadow-lg", interactionMode === 'select' && "bg-primary text-primary-foreground")}
            >
              {interactionMode === 'pan' ? <Hand size={18} weight="duotone" /> : <Selection size={18} weight="duotone" />}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Toggle mode <span className="text-muted-foreground ml-2">V</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              onClick={() => {
                setShowMinimap(prev => !prev)
                toast.info(`Minimap ${!showMinimap ? 'enabled' : 'disabled'}`)
              }}
              className={cn("shadow-lg", showMinimap && "bg-primary text-primary-foreground")}
            >
              <MapTrifold size={18} weight="duotone" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Toggle minimap <span className="text-muted-foreground ml-2">⌘M</span>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="secondary"
              onClick={centerCanvas}
              className="shadow-lg"
            >
              <CornersOut size={18} weight="duotone" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Fit all nodes <span className="text-muted-foreground ml-2">⌘0</span>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      <motion.div 
        className="absolute bottom-4 right-4 z-10 flex items-center gap-2 bg-card border border-border rounded-md px-3 py-2 text-sm shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.2 }}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setZoom(Math.max(zoom - 0.1, 0.1))}
            >
              <span className="text-lg">−</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Zoom out <span className="text-muted-foreground ml-2">⌘-</span>
          </TooltipContent>
        </Tooltip>
        
        <span className="font-mono text-xs w-12 text-center">
          {Math.round(zoom * 100)}%
        </span>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              size="icon"
              variant="ghost"
              className="h-6 w-6"
              onClick={() => setZoom(Math.min(zoom + 0.1, 3))}
            >
              <span className="text-lg">+</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            Zoom in <span className="text-muted-foreground ml-2">⌘=</span>
          </TooltipContent>
        </Tooltip>
      </motion.div>

      <AnimatePresence>
        {showMinimap && (
          <motion.div 
            className="absolute top-4 right-4 z-10 border-2 border-border rounded-md overflow-hidden shadow-lg"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <canvas ref={minimapRef} className="block" />
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={canvasRef}
        className={cn(
          'flex-1 relative overflow-hidden',
          isDraggingCanvas ? 'cursor-grabbing' : 
          isSelecting ? 'cursor-crosshair' : 
          interactionMode === 'select' ? 'cursor-crosshair' : 'cursor-grab'
        )}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <motion.div
          className="canvas-background absolute inset-0"
          style={{
            backgroundImage: showGrid ? `
              radial-gradient(circle, oklch(0.25 0.05 270 / 0.3) 1px, transparent 1px)
            ` : 'none',
            backgroundSize: `${20 * zoom}px ${20 * zoom}px`,
            x: panX,
            y: panY,
          }}
        />

        <svg
          className="absolute inset-0 pointer-events-none"
          style={{ zIndex: 1 }}
        >
          <defs>
            <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="oklch(0.75 0.15 195)" stopOpacity="0.3" />
              <stop offset="50%" stopColor="oklch(0.65 0.28 330)" stopOpacity="0.6" />
              <stop offset="100%" stopColor="oklch(0.75 0.15 195)" stopOpacity="0.3" />
            </linearGradient>
          </defs>
          
          {connections.map((conn) => {
            const sourceNode = nodes.find((n) => n.id === conn.source)
            const targetNode = nodes.find((n) => n.id === conn.target)

            if (!sourceNode || !targetNode) return null

            const currentPanX = panX.get()
            const currentPanY = panY.get()

            const x1 = (sourceNode.position.x + sourceNode.size.width / 2) * zoom + currentPanX
            const y1 = (sourceNode.position.y + sourceNode.size.height / 2) * zoom + currentPanY
            const x2 = (targetNode.position.x + targetNode.size.width / 2) * zoom + currentPanX
            const y2 = (targetNode.position.y + targetNode.size.height / 2) * zoom + currentPanY

            const midX = (x1 + x2) / 2
            const midY = (y1 + y2) / 2
            const dx = x2 - x1
            const dy = y2 - y1
            const dist = Math.sqrt(dx * dx + dy * dy)
            const curve = Math.min(dist * 0.25, 100)

            return (
              <g key={conn.id}>
                <path
                  d={`M ${x1} ${y1} Q ${midX} ${midY - curve} ${x2} ${y2}`}
                  stroke="url(#connection-gradient)"
                  strokeWidth={2}
                  fill="none"
                />
                <circle
                  cx={midX}
                  cy={midY - curve / 2}
                  r={3}
                  fill="oklch(0.65 0.28 330)"
                  opacity={0.8}
                >
                  <animate
                    attributeName="r"
                    values="3;5;3"
                    dur="2s"
                    repeatCount="indefinite"
                  />
                </circle>
              </g>
            )
          })}
        </svg>

        {isSelecting && (
          <div
            className="absolute border-2 border-primary bg-primary/10 pointer-events-none z-50"
            style={{
              left: Math.min(selectionStart.x, selectionEnd.x),
              top: Math.min(selectionStart.y, selectionEnd.y),
              width: Math.abs(selectionEnd.x - selectionStart.x),
              height: Math.abs(selectionEnd.y - selectionStart.y),
            }}
          />
        )}

        <motion.div
          className="absolute"
          style={{
            x: panX,
            y: panY,
            scale: zoom,
            transformOrigin: '0 0',
            zIndex: 2,
          }}
        >
          <AnimatePresence mode="popLayout">
            {nodes.map((node) => (
              <CanvasNodeComponent
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id || selectedNodes.has(node.id)}
                onSelect={() => onSelectNode(node.id)}
                onUpdate={(updates) => onUpdateNode(node.id, updates)}
                onDelete={() => onDeleteNode(node.id)}
                zoom={zoom}
              />
            ))}
          </AnimatePresence>
        </motion.div>

        {nodes.length === 0 && (
          <motion.div 
            className="absolute inset-0 flex items-center justify-center pointer-events-none"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="text-center">
              <Plus size={48} weight="duotone" className="text-muted-foreground mx-auto mb-4 opacity-30" />
              <p className="text-muted-foreground text-sm">
                Click a button above to add your first node
              </p>
              <p className="text-muted-foreground text-xs mt-2">
                Scroll to pan • ⌘+Scroll to zoom • ⌘+0 to fit all
              </p>
              <p className="text-muted-foreground text-xs mt-1">
                V to toggle select mode • ⌘M for minimap • Space to pan
              </p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
