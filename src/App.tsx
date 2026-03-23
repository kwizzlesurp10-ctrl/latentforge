import { useKV } from '@github/spark/hooks'
import { useState, useCallback } from 'react'
import { VaultItem, CanvasNode, Connection } from '@/lib/types'
import { generateId } from '@/lib/utils'
import { VaultSidebar } from '@/components/vault/VaultSidebar'
import { ForgeCanvas } from '@/components/canvas/ForgeCanvas'
import { QuickCapture } from '@/components/vault/QuickCapture'
import { CommandPalette } from '@/components/CommandPalette'
import { AIPreviewPanel } from '@/components/AIPreviewPanel'
import { PWAInstallBanner } from '@/components/PWAInstallBanner'
import { Toaster } from '@/components/ui/sonner'
import { Archive, Sparkle, GitBranch } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

function App() {
  const [vaultItems, setVaultItems] = useKV<VaultItem[]>('vault-items', [])
  const [canvasNodes, setCanvasNodes] = useKV<CanvasNode[]>('canvas-nodes', [])
  const [connections, setConnections] = useKV<Connection[]>('canvas-connections', [])
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isCommandOpen, setIsCommandOpen] = useState(false)
  const [isQuickCaptureOpen, setIsQuickCaptureOpen] = useState(false)
  const [isAIPreviewOpen, setIsAIPreviewOpen] = useState(false)
  
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
      id: generateId('vault'),
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
      id: generateId('node'),
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
      id: generateId('conn'),
      source,
      target,
    }
    
    setConnections((current) => [...(current || []), newConnection])
  }, [setConnections])

  return (
    <TooltipProvider delayDuration={100}>
      <div className="h-screen w-screen overflow-hidden bg-background text-foreground flex flex-col">
        <header className="h-14 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="glow-hover"
              aria-label="Toggle vault sidebar"
            >
              <Archive size={20} weight="duotone" />
            </Button>
            <h1 className="text-xl font-bold tracking-tight font-display">
              <span className="text-primary">Latent</span>
              <span className="text-secondary">Forge</span>
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsCommandOpen(true)}
                  className="glow-hover"
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
                  className="glow-hover"
                >
                  <GitBranch size={20} weight="duotone" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Timeline <span className="text-muted-foreground ml-2">⌘T</span></p>
              </TooltipContent>
            </Tooltip>

            <Button
              onClick={() => setIsQuickCaptureOpen(true)}
              className="glow-primary ml-2"
              size="sm"
            >
              Quick Capture
              <span className="ml-2 text-xs text-primary-foreground/70">⌘K</span>
            </Button>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          <VaultSidebar
            items={vaultItems || []}
            isOpen={isSidebarOpen}
            onAddItem={addVaultItem}
            onUpdateItem={updateVaultItem}
            onDeleteItem={deleteVaultItem}
            onClose={() => setIsSidebarOpen(false)}
            selectedItemId={selectedVaultItemId}
            onSelectItem={handleSelectVaultItem}
          />

          <ForgeCanvas
            nodes={canvasNodes || []}
            connections={connections || []}
            onAddNode={addCanvasNode}
            onUpdateNode={updateCanvasNode}
            onDeleteNode={deleteCanvasNode}
            onAddConnection={addConnection}
            selectedNodeId={selectedCanvasNodeId}
            onSelectNode={handleSelectCanvasNode}
          />

          {isAIPreviewOpen && (
            <AIPreviewPanel
              selectedItem={selectedVaultItem}
              selectedNode={selectedCanvasNode}
              onClose={() => {
                setIsAIPreviewOpen(false)
                setSelectedVaultItemId(null)
                setSelectedCanvasNodeId(null)
              }}
            />
          )}
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
        />

        <Toaster position="bottom-right" theme="dark" />
        <PWAInstallBanner />
      </div>
    </TooltipProvider>
  )
}

export default App
