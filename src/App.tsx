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
import { Toaster } from '@/components/ui/sonner'
import { Archive, Sparkle, GitBranch, Gear } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'sonner'

function App() {
  const [vaultItems, setVaultItems] = useKV<VaultItem[]>('vault-items', [])
  const [canvasNodes, setCanvasNodes] = useKV<CanvasNode[]>('canvas-nodes', [])
  const [connections, setConnections] = useKV<Connection[]>('canvas-connections', [])
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
  const [vaultTypeFilter, setVaultTypeFilter] = useState<VaultItem['type'] | null>(null)
  
  const [selectedVaultItemId, setSelectedVaultItemId] = useState<string | null>(null)
  const [selectedCanvasNodeId, setSelectedCanvasNodeId] = useState<string | null>(null)

  const handleSelectVaultItem = useCallback((id: string) => {
    setSelectedVaultItemId(id)
    setSelectedCanvasNodeId(null)
    setIsAIPreviewOpen(true)
  }, [])

  const handleSelectCanvasNode = useCallback((id: string | null) => {
    setSelectedCanvasNodeId(id)
    setSelectedVaultItemId(null)
    if (id) {
      setIsAIPreviewOpen(true)
    }
  }, [])

  const selectedVaultItem = selectedVaultItemId 
    ? vaultItems?.find(item => item.id === selectedVaultItemId)
    : null

  const selectedCanvasNode = selectedCanvasNodeId 
    ? canvasNodes?.find(node => node.id === selectedCanvasNodeId)
    : null

  const addVaultItem = useCallback((item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => {
    const newItem: VaultItem = {
      ...item,
      id: `vault-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      version: 1,
    }
    
    setVaultItems((current) => [newItem, ...(current || [])])
    return newItem
  }, [setVaultItems])

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
    
    setCanvasNodes((current) => [...(current || []), newNode])
    return newNode
  }, [setCanvasNodes])

  const updateCanvasNode = useCallback((id: string, updates: Partial<CanvasNode>) => {
    setCanvasNodes((current) =>
      (current || []).map((node) => (node.id === id ? { ...node, ...updates } : node))
    )
  }, [setCanvasNodes])

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
        toast.info('Timeline coming soon!', { duration: 2000 })
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
          setSelectedCanvasNodeId(null)
        } else if (selectedCanvasNodeId || selectedVaultItemId) {
          setSelectedVaultItemId(null)
          setSelectedCanvasNodeId(null)
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
                  onClick={() => toast.info('Timeline coming soon!', { duration: 2000 })}
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
            selectedNodeId={selectedCanvasNodeId}
            onSelectNode={handleSelectCanvasNode}
            zoomSpeed={settings?.canvas.zoomSpeed || 1}
            showGrid={settings?.ui.showGrid ?? true}
          />

          <AnimatePresence mode="wait">
            {isAIPreviewOpen && (selectedVaultItem || selectedCanvasNode) && (
              <motion.div
                initial={{ x: 400, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 400, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                <AIPreviewPanel
                  selectedItem={selectedVaultItem}
                  selectedNode={selectedCanvasNode}
                  onClose={() => {
                    setIsAIPreviewOpen(false)
                    setSelectedVaultItemId(null)
                    setSelectedCanvasNodeId(null)
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
