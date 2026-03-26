import { useKV } from '@github/spark/hooks'
import { useState, useCallback, useEffect } from 'react'
import { VaultItem, CanvasNode, Connection, UserSettings } from '@/lib/types'
import { VaultSidebar } from '@/components/vault/VaultSidebar'
import { ForgeCanvas } from '@/components/canvas/ForgeCanvas'
import { QuickCapture } from '@/components/vault/QuickCapture'
import { CommandPalette } from '@/components/CommandPalette'
import { AIPreviewPanel } from '@/components/AIPreviewPanel'
import { PWAInstallBanner } from '@/components/PWAInstallBanner'
import { SettingsDialog } from '@/components/SettingsDialog'
import { TimelineView } from '@/components/TimelineView'
import { AgentSwarm } from '@/components/AgentSwarm'
import { ExportDialog } from '@/components/ExportDialog'
import { Toaster } from '@/components/ui/sonner'
import { Archive, Sparkle, GitBranch, Gear, Lightning, Download } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

function App() {
  const [vaultItems, setVaultItems] = useKV<VaultItem[]>('vault-items', [])
  const [canvasNodes, setCanvasNodes] = useKV<CanvasNode[]>('canvas-nodes', [])
  const [connections, setConnections] = useKV<Connection[]>('canvas-connections', [])
  const [timelineNodes, setTimelineNodes] = useKV<TimelineNode[]>('timeline-nodes', [])
  const [agents, setAgents] = useKV<Agent[]>('agents', [])
  const [settings, setSettings] = useKV<UserSettings>('user-settings', {
    canvas: {
      zoomSpeed: 1,
      panSensitivity: 1,
    },
    ui: {
      showMinimap: false,
      showGrid: true,
    },
    keyboard: {
      enableShortcuts: true,
    },
  })
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
  const [isAIPreviewOpen, setIsAIPreviewOpen] = useState(false)
  const [isSettingsOpen, setIsSettingsOpen] = useState(false)
  const [isTimelineOpen, setIsTimelineOpen] = useState(false)
  const [isAgentPanelOpen, setIsAgentPanelOpen] = useState(false)
  const [isExportOpen, setIsExportOpen] = useState(false)
  const [vaultTypeFilter, setVaultTypeFilter] = useState<VaultItem['type'] | null>(null)
  
  const [selectedVaultItemId, setSelectedVaultItemId] = useState<string | null>(null)
  const [selectedCanvasNodeIds, setSelectedCanvasNodeIds] = useState<string[]>([])

  const handleSelectVaultItem = useCallback((id: string) => {
    setSelectedVaultItemId(id)
    setSelectedCanvasNodeIds([])
    setIsAIPreviewOpen(true)
  }, [])

  const handleSelectCanvasNodes = useCallback((ids: string[]) => {
    setSelectedCanvasNodeIds(ids)
    setSelectedVaultItemId(null)
    if (ids.length > 0) {
      setIsAIPreviewOpen(true)
    }
  }, [])

  const selectedVaultItem = selectedVaultItemId 
    ? vaultItems?.find(item => item.id === selectedVaultItemId)
    : null

  const selectedCanvasNodes = selectedCanvasNodeIds.length > 0
    ? canvasNodes?.filter(node => selectedCanvasNodeIds.includes(node.id))
    : []

  const addVaultItem = useCallback(async (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newItem: VaultItem = {
      ...item,
      id: `vault-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    }
    
    setVaultItems((current) => {
      const next = [newItem, ...(current || [])]
      addTimelineSnapshot('vault-item', `Added vault item: ${newItem.content.slice(0, 30)}...`, {
        vaultItems: next,
        canvasNodes: canvasNodes || [],
        connections: connections || [],
      })
      return next
    })

    // Semantic Auto-Tagging
    try {
      const prompt = spark.llmPrompt`Analyze this content and provide 3-5 relevant semantic tags. 
Content: ${newItem.content}
Return only the tags separated by commas, no preamble.`
      
      const response = await spark.llm(prompt, 'gpt-4o-mini', false)
      const newTags = response.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag.length > 0)
      
      if (newTags.length > 0) {
        setVaultItems((current) => 
          (current || []).map(item => 
            item.id === newItem.id 
              ? { ...item, tags: Array.from(new Set([...item.tags, ...newTags])) }
              : item
          )
        )
      }
    } catch (error) {
      console.error('Auto-tagging error:', error)
    }

    return newItem
  }, [setVaultItems, addTimelineSnapshot, canvasNodes, connections])

  const updateVaultItem = useCallback((id: string, updates: Partial<VaultItem>) => {
    setVaultItems((current) =>
      (current || []).map((item) =>
        item.id === id
          ? { ...item, ...updates, updatedAt: Date.now(), version: item.version + 1 }
          : item
      )
    )
  }, [setVaultItems])

  const deleteVaultItem = useCallback((id: string) => {
    setVaultItems((current) => (current || []).filter((item) => item.id !== id))
  }, [setVaultItems])

  const addCanvasNode = useCallback((node: Omit<CanvasNode, 'id'>) => {
    const newNode: CanvasNode = {
      ...node,
      id: `node-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    }
    
    setCanvasNodes((current) => {
      const next = [...(current || []), newNode]
      addTimelineSnapshot('canvas-change', `Added ${newNode.type} node`, {
        vaultItems: vaultItems || [],
        canvasNodes: next,
        connections: connections || [],
      })
      return next
    })
    return newNode
  }, [setCanvasNodes, addTimelineSnapshot, vaultItems, connections])

  const updateCanvasNode = useCallback((id: string, updates: Partial<CanvasNode>) => {
    setCanvasNodes((current) =>
      (current || []).map((node) => (node.id === id ? { ...node, ...updates } : node))
    )
  }, [setCanvasNodes])

  const updateCanvasNodes = useCallback((updates: Record<string, Partial<CanvasNode>>) => {
    setCanvasNodes((current) =>
      (current || []).map((node) => 
        updates[node.id] ? { ...node, ...updates[node.id] } : node
      )
    )
    addTimelineSnapshot('canvas-change', `Batch updated ${Object.keys(updates).length} nodes`, {
      vaultItems: vaultItems || [],
      canvasNodes: (canvasNodes || []).map(node => updates[node.id] ? { ...node, ...updates[node.id] } : node),
      connections: connections || [],
    })
  }, [setCanvasNodes, addTimelineSnapshot, vaultItems, canvasNodes, connections])

  const deleteCanvasNode = useCallback((id: string) => {
    setCanvasNodes((current) => (current || []).filter((node) => node.id !== id))
    setConnections((current) =>
      (current || []).filter((conn) => conn.source !== id && conn.target !== id)
    )
  }, [setCanvasNodes, setConnections])

  const addConnection = useCallback((source: string, target: string) => {
    const newConnection: Connection = {
      id: `conn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      source,
      target,
    }
    
    setConnections((current) => [...(current || []), newConnection])
  }, [setConnections])

  const addTimelineSnapshot = useCallback((type: TimelineNode['type'], description: string, snapshot: any) => {
    const newNode: TimelineNode = {
      id: `time-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      type,
      description,
      snapshot,
      parentIds: timelineNodes?.length ? [timelineNodes[0].id] : [],
    }
    setTimelineNodes((current) => [newNode, ...(current || [])])
  }, [timelineNodes, setTimelineNodes])

  const resurrectSnapshot = useCallback((snapshot: any) => {
    setVaultItems(snapshot.vaultItems || [])
    setCanvasNodes(snapshot.canvasNodes || [])
    setConnections(snapshot.connections || [])
    toast.success('Snapshot resurrected')
    setIsTimelineOpen(false)
  }, [setVaultItems, setCanvasNodes, setConnections])

  const spawnAgent = useCallback(async (type: Agent['type'], input: string) => {
    const newAgent: Agent = {
      id: `agent-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      status: 'processing',
      input,
      outputs: [],
      createdAt: Date.now(),
    }
    
    setAgents((current) => [newAgent, ...(current || [])])
    
    try {
      const prompt = spark.llmPrompt`You are a specialized AI agent: ${type}. 
Input: ${input}
Provide 3 divergent and creative explorations or solutions based on this input. 
Format each one clearly using Markdown.`

      const response = await spark.llm(prompt, 'gpt-4o-mini', false)
      
      const outputs: AgentOutput[] = [
        {
          id: `out-${Date.now()}-1`,
          content: response,
          timestamp: Date.now(),
        }
      ]
      
      setAgents((current) => 
        (current || []).map(a => a.id === newAgent.id ? { ...a, status: 'complete', outputs } : a)
      )
      
      addTimelineSnapshot('agent-spawn', `Agent ${type} completed exploration`, {
        vaultItems: vaultItems || [],
        canvasNodes: canvasNodes || [],
        connections: connections || [],
      })
      
      toast.success(`Agent ${type} completed task`)
    } catch (error) {
      console.error('Agent error:', error)
      setAgents((current) => 
        (current || []).map(a => a.id === newAgent.id ? { ...a, status: 'error' } : a)
      )
      toast.error(`Agent ${type} failed`)
    }
  }, [setAgents, addTimelineSnapshot, vaultItems, canvasNodes, connections])

  const handleViewAllItems = useCallback(() => {
    setIsSidebarOpen(true)
    setVaultTypeFilter(null)
  }, [])

  const handleFilterByType = useCallback((type: VaultItem['type']) => {
    setIsSidebarOpen(true)
    setVaultTypeFilter(type)
  }, [])

  const handleOpenAIPreview = useCallback(() => {
    setIsAIPreviewOpen(true)
  }, [])

  const handleUpdateSettings = useCallback((newSettings: UserSettings) => {
    setSettings(newSettings)
  }, [setSettings])

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement
      const isInputField = target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setIsQuickCaptureOpen(true)
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault()
        setIsCommandOpen(true)
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 't') {
        e.preventDefault()
        setIsTimelineOpen(prev => !prev)
      }

      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key === 'a') {
        e.preventDefault()
        setIsAgentPanelOpen(prev => !prev)
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'b') {
        e.preventDefault()
        setIsSidebarOpen(prev => {
          const newState = !prev
          toast.info(`Sidebar ${newState ? 'opened' : 'closed'}`, { duration: 1500 })
          return newState
        })
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === 'p' && e.shiftKey) {
        e.preventDefault()
        setIsAIPreviewOpen(prev => {
          const newState = !prev
          toast.info(`AI Preview ${newState ? 'opened' : 'closed'}`, { duration: 1500 })
          return newState
        })
      }
      
      if ((e.metaKey || e.ctrlKey) && e.key === ',') {
        e.preventDefault()
        setIsSettingsOpen(true)
      }
      
      if (e.key === 'Escape') {
        if (isQuickCaptureOpen) {
          setIsQuickCaptureOpen(false)
        } else if (isCommandOpen) {
          setIsCommandOpen(false)
        } else if (isAIPreviewOpen) {
          setIsAIPreviewOpen(false)
          setSelectedVaultItemId(null)
          setSelectedCanvasNodeIds([])
        } else if (selectedCanvasNodeIds.length > 0 || selectedVaultItemId) {
          setSelectedVaultItemId(null)
          setSelectedCanvasNodeIds([])
        }
      }
      
      if (!isInputField && (e.key === 'ArrowLeft' || e.key === 'ArrowRight' || e.key === 'ArrowUp' || e.key === 'ArrowDown')) {
        if (selectedVaultItemId && (vaultItems?.length ?? 0) > 0) {
          e.preventDefault()
          const currentIndex = vaultItems?.findIndex(item => item.id === selectedVaultItemId) ?? -1
          if (currentIndex !== -1) {
            let newIndex = currentIndex
            if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
              newIndex = Math.min((vaultItems?.length ?? 0) - 1, currentIndex + 1)
            } else if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
              newIndex = Math.max(0, currentIndex - 1)
            }
            if (newIndex !== currentIndex && vaultItems) {
              setSelectedVaultItemId(vaultItems[newIndex].id)
            }
          }
        }
      }
    }

    window.addEventListener('keydown', handleGlobalKeyDown)
    return () => window.removeEventListener('keydown', handleGlobalKeyDown)
  }, [isQuickCaptureOpen, isCommandOpen, isAIPreviewOpen, isSidebarOpen, selectedVaultItemId, selectedCanvasNodeId, vaultItems])

  return (
    <TooltipProvider delayDuration={100}>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
        <motion.header 
          className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0 relative z-20"
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <div className="flex items-center gap-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                  className="glow-hover transition-all duration-200"
                  aria-label="Toggle vault sidebar"
                >
                  <Archive size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Toggle Vault <span className="text-muted-foreground ml-2">⌘B</span></p>
              </TooltipContent>
            </Tooltip>
            <motion.h1 
              className="text-xl font-bold tracking-tight font-display"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
            >
              <span className="text-primary">Latent</span>
              <span className="text-secondary">Forge</span>
            </motion.h1>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsAgentPanelOpen(true)}
                  className="glow-hover transition-all duration-200"
                >
                  <Lightning size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Agent Swarm <span className="text-muted-foreground ml-2">⌘⇧A</span></p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCommandOpen(true)}
                  className="glow-hover transition-all duration-200"
                >
                  <Sparkle size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>AI Co-pilot <span className="text-muted-foreground ml-2">⌘/</span></p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsTimelineOpen(true)}
                  className="glow-hover transition-all duration-200"
                >
                  <GitBranch size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Timeline <span className="text-muted-foreground ml-2">⌘T</span></p>
              </TooltipContent>
            </Tooltip>

            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsSettingsOpen(true)}
                  className="glow-hover transition-all duration-200"
                >
                  <Gear size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Settings <span className="text-muted-foreground ml-2">⌘,</span></p>
              </TooltipContent>
            </Tooltip>

            <Button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="glow-primary ml-2 transition-all duration-200 hover:scale-105"
              size="sm"
            >
              Quick Capture
              <span className="ml-2 text-xs text-primary-foreground/70">⌘K</span>
            </Button>
          </div>
        </motion.header>

        <div className="flex-1 flex overflow-hidden relative">
          <AnimatePresence mode="wait">
            {isSidebarOpen && (
              <motion.div
                initial={{ x: -300, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -300, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <VaultSidebar
                  items={vaultItems || []}
                  isOpen={isSidebarOpen}
                  onAddItem={addVaultItem}
                  onUpdateItem={updateVaultItem}
                  onDeleteItem={deleteVaultItem}
                  onClose={() => setIsSidebarOpen(false)}
                  selectedItemId={selectedVaultItemId}
                  onSelectItem={handleSelectVaultItem}
                  typeFilter={vaultTypeFilter}
                  onClearTypeFilter={() => setVaultTypeFilter(null)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          <ForgeCanvas
            nodes={canvasNodes || []}
            connections={connections || []}
            onAddNode={addCanvasNode}
            onUpdateNode={updateCanvasNode}
            onDeleteNode={deleteCanvasNode}
            onAddConnection={addConnection}
            selectedNodeIds={selectedCanvasNodeIds}
            onSelectNodes={handleSelectCanvasNodes}
            zoomSpeed={settings?.canvas.zoomSpeed || 1}
            showGrid={settings?.ui.showGrid ?? true}
          />

          <AnimatePresence mode="wait">
            {isAIPreviewOpen && (selectedVaultItem || selectedCanvasNodes.length > 0) && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AIPreviewPanel
                  selectedItem={selectedVaultItem}
                  selectedNodes={selectedCanvasNodes}
                  onExport={() => setIsExportOpen(true)}
                  onClose={() => {
                    setIsAIPreviewOpen(false)
                    setSelectedVaultItemId(null)
                    setSelectedCanvasNodeIds([])
                  }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <QuickCapture
          isOpen={isQuickCaptureOpen}
          onClose={() => setIsQuickCaptureOpen(false)}
          onSave={addVaultItem}
        />

        <CommandPalette
          isOpen={isCommandOpen}
          onClose={() => setIsCommandOpen(false)}
          onOpenQuickCapture={() => {
            setIsCommandOpen(false)
            setIsQuickCaptureOpen(true)
          }}
          onViewAllItems={handleViewAllItems}
          onFilterByType={handleFilterByType}
          onOpenAIPreview={handleOpenAIPreview}
        />

        <Toaster position="bottom-right" theme="dark" />
        <PWAInstallBanner />
        
        <TimelineView 
          isOpen={isTimelineOpen}
          onClose={() => setIsTimelineOpen(false)}
          nodes={timelineNodes || []}
          onResurrect={resurrectSnapshot}
        />
        
        <AgentSwarm
          isOpen={isAgentPanelOpen}
          onClose={() => setIsAgentPanelOpen(false)}
          agents={agents || []}
          onSpawn={spawnAgent}
          selectedContent={selectedVaultItem?.content || selectedCanvasNodes.map(n => n.content).join('\n---\n') || undefined}
        />

        <ExportDialog
          isOpen={isExportOpen}
          onClose={() => setIsExportOpen(false)}
          item={selectedVaultItem}
          nodes={selectedCanvasNodes}
        />
        
        <SettingsDialog
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          settings={settings || {
            canvas: { zoomSpeed: 1, panSensitivity: 1 },
            ui: { showMinimap: false, showGrid: true },
            keyboard: { enableShortcuts: true },
          }}
          onUpdateSettings={handleUpdateSettings}
        />
      </div>
    </TooltipProvider>
  )
}

export default App
