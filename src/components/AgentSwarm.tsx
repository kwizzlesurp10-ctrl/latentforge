import { Agent, AgentOutput } from '@/lib/types'
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle,
  SheetDescription
} from '@/components/ui/sheet'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Markdown } from '@/components/Markdown'
import { 
  Lightning, 
  Flask, 
  Code, 
  Palette, 
  ArrowsClockwise,
  CheckCircle,
  XCircle,
  Plus
} from '@phosphor-icons/react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AgentSwarmProps {
  isOpen: boolean
  onClose: () => void
  agents: Agent[]
  onSpawn: (type: Agent['type'], input: string) => void
  selectedContent?: string
}

export function AgentSwarm({ isOpen, onClose, agents, onSpawn, selectedContent }: AgentSwarmProps) {
  const [activeTab, setActiveTab] = useState<'launcher' | 'active'>('launcher')

  const agentTypes: { type: Agent['type'], label: string, description: string, icon: any, color: string }[] = [
    { 
      type: 'researcher', 
      label: 'Researcher', 
      description: 'Dives deep into concepts and synthesizes cross-disciplinary insights.',
      icon: Flask,
      color: 'text-primary'
    },
    { 
      type: 'code-architect', 
      label: 'Code Architect', 
      description: 'Designs technical implementations and explores structural patterns.',
      icon: Code,
      color: 'text-secondary'
    },
    { 
      type: 'visualizer', 
      label: 'Visualizer', 
      description: 'Generates creative metaphors, visual descriptions, and moodboard concepts.',
      icon: Palette,
      color: 'text-accent'
    }
  ]

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent side="right" className="w-[450px] border-l border-border bg-card p-0">
        <div className="h-full flex flex-col">
          <SheetHeader className="p-6 border-b border-border text-left">
            <SheetTitle className="flex items-center gap-2">
              <Lightning size={20} weight="duotone" className="text-primary" />
              Agent Swarm Launcher
            </SheetTitle>
            <SheetDescription>
              Deploy specialized agents to expand your latent space.
            </SheetDescription>
          </SheetHeader>

          <div className="flex border-b border-border">
            <button 
              onClick={() => setActiveTab('launcher')}
              className={cn(
                "flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors",
                activeTab === 'launcher' ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Launcher
            </button>
            <button 
              onClick={() => setActiveTab('active')}
              className={cn(
                "flex-1 py-3 text-xs font-semibold uppercase tracking-wider transition-colors relative",
                activeTab === 'active' ? "text-primary border-b-2 border-primary" : "text-muted-foreground hover:text-foreground"
              )}
            >
              Active Swarm
              {agents.filter(a => a.status === 'processing').length > 0 && (
                <span className="absolute top-2 right-1/4 w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              )}
            </button>
          </div>

          <ScrollArea className="flex-1">
            <div className="p-6">
              {activeTab === 'launcher' ? (
                <div className="space-y-6">
                  <div className="p-4 rounded-md bg-muted/20 border border-border">
                    <h4 className="text-xs font-bold uppercase text-muted-foreground mb-2">Target Content</h4>
                    <p className="text-sm text-foreground line-clamp-3 italic opacity-80">
                      {selectedContent || "No content selected. Agents will use universal latent space context."}
                    </p>
                  </div>

                  <div className="grid gap-4">
                    {agentTypes.map((config) => (
                      <Card 
                        key={config.type}
                        className="p-4 border-border hover:border-primary/50 transition-all group cursor-default glow-hover"
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn("p-2 rounded-md bg-muted transition-colors group-hover:bg-primary/10", config.color)}>
                            <config.icon size={20} weight="duotone" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-semibold mb-1 group-hover:text-primary transition-colors">
                              {config.label}
                            </h4>
                            <p className="text-xs text-muted-foreground mb-3 leading-relaxed">
                              {config.description}
                            </p>
                            <Button 
                              size="sm" 
                              className="w-full text-xs glow-primary"
                              onClick={() => {
                                onSpawn(config.type, selectedContent || "Global context exploration")
                                setActiveTab('active')
                              }}
                            >
                              <Plus size={14} className="mr-1" />
                              Spawn Agent
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  {agents.length === 0 ? (
                    <div className="text-center py-12">
                      <Lightning size={48} weight="duotone" className="text-muted-foreground opacity-20 mx-auto mb-4" />
                      <p className="text-sm text-muted-foreground">
                        No active agents. Launch one from the Launcher tab!
                      </p>
                    </div>
                  ) : (
                    agents.map((agent) => (
                      <Card key={agent.id} className="p-4 border-border overflow-hidden">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center gap-2">
                            {agent.status === 'processing' ? (
                              <ArrowsClockwise size={16} className="text-primary animate-spin" />
                            ) : agent.status === 'complete' ? (
                              <CheckCircle size={16} className="text-secondary" />
                            ) : (
                              <XCircle size={16} className="text-destructive" />
                            )}
                            <span className="text-xs font-bold uppercase tracking-wider">{agent.type}</span>
                          </div>
                          <Badge variant="outline" className="text-[10px]">
                            {agent.status}
                          </Badge>
                        </div>

                        <div className="text-xs text-muted-foreground mb-4 bg-muted/30 p-2 rounded">
                          <span className="font-bold opacity-60">Input:</span> {agent.input.slice(0, 100)}...
                        </div>

                        {agent.outputs.map((output) => (
                          <div key={output.id} className="mt-4 animate-in fade-in duration-500">
                            <div className="flex items-center justify-between mb-2">
                              <span className="text-[10px] font-mono text-muted-foreground/60">
                                Output result
                              </span>
                            </div>
                            <Markdown content={output.content} className="text-xs border-l-2 border-primary/30 pl-3 py-1" />
                          </div>
                        ))}
                      </Card>
                    ))
                  )}
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </SheetContent>
    </Sheet>
  )
}
