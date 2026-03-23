import { useState, useEffect, useCallback } from 'react'
import { VaultItem, CanvasNode } from '@/lib/types'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Sparkle, 
  Code, 
  ListBullets, 
  ArrowsClockwise,
  Copy,
  CheckCircle
} from '@phosphor-icons/react'
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

interface AIPreviewPanelProps {
  selectedItem?: VaultItem | null
  selectedNode?: CanvasNode | null
  onClose: () => void
}

type PreviewMode = 'refine' | 'expand' | 'extract' | 'transform'

interface StreamingResult {
  content: string
  isComplete: boolean
}

export function AIPreviewPanel({ selectedItem, selectedNode, onClose }: AIPreviewPanelProps) {
  const [mode, setMode] = useState<PreviewMode>('refine')
  const [result, setResult] = useState<StreamingResult>({ content: '', isComplete: false })
  const [isGenerating, setIsGenerating] = useState(false)
  const [copied, setCopied] = useState(false)

  const currentContent = selectedItem?.content || selectedNode?.content || ''
  const currentType = selectedItem?.type || selectedNode?.type || 'text'

  const generatePreview = useCallback(async (selectedMode: PreviewMode) => {
    if (!currentContent.trim()) return

    setIsGenerating(true)
    setResult({ content: '', isComplete: false })

    try {
      let prompt = ''
      
      switch (selectedMode) {
        case 'refine':
          prompt = spark.llmPrompt`You are a creative assistant helping refine ideas. Take this ${currentType} content and improve it with better clarity, structure, and impact. Keep the same core idea but make it more compelling:

Content: ${currentContent}

Provide the refined version directly without preamble or explanation.`
          break
        
        case 'expand':
          prompt = spark.llmPrompt`You are a creative assistant helping expand ideas. Take this ${currentType} content and expand it with additional details, context, and depth. Add 2-3 related concepts or implementation ideas:

Content: ${currentContent}

Provide the expanded version directly.`
          break
        
        case 'extract':
          prompt = spark.llmPrompt`You are an analytical assistant. Extract key insights, action items, and core concepts from this ${currentType} content. Format as a concise bulleted list:

Content: ${currentContent}

Provide bullet points only.`
          break
        
        case 'transform':
          if (currentType === 'code') {
            prompt = spark.llmPrompt`Convert this code into well-documented pseudocode or a technical explanation:

${currentContent}

Explain what it does and why.`
          } else if (currentType === 'text' || currentType === 'prompt') {
            prompt = spark.llmPrompt`Transform this idea into a structured implementation plan with clear steps:

${currentContent}

Create an actionable plan.`
          } else {
            prompt = spark.llmPrompt`Transform this content into a different format that makes it more useful:

${currentContent}

Provide the transformed version.`
          }
          break
      }

      const modelName = 'gpt-4o-mini'
      const response = await spark.llm(prompt, modelName, false)
      
      let displayedContent = ''
      const words = response.split(' ')
      
      for (let i = 0; i < words.length; i++) {
        displayedContent += (i > 0 ? ' ' : '') + words[i]
        setResult({ content: displayedContent, isComplete: false })
        await new Promise(resolve => setTimeout(resolve, 30))
      }
      
      setResult({ content: response, isComplete: true })
    } catch (error) {
      console.error('AI generation error:', error)
      setResult({ 
        content: 'Failed to generate preview. Please try again.', 
        isComplete: true 
      })
      toast.error('Preview generation failed')
    } finally {
      setIsGenerating(false)
    }
  }, [currentContent, currentType])

  useEffect(() => {
    if (currentContent.trim()) {
      generatePreview(mode)
    }
  }, [selectedItem?.id, selectedNode?.id, mode])

  const handleCopy = async () => {
    if (result.content) {
      await navigator.clipboard.writeText(result.content)
      setCopied(true)
      toast.success('Copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const getModeConfig = (m: PreviewMode) => {
    switch (m) {
      case 'refine':
        return { label: 'Refine', icon: Sparkle, color: 'text-primary' }
      case 'expand':
        return { label: 'Expand', icon: ListBullets, color: 'text-secondary' }
      case 'extract':
        return { label: 'Extract', icon: Code, color: 'text-accent' }
      case 'transform':
        return { label: 'Transform', icon: ArrowsClockwise, color: 'text-cyan-400' }
    }
  }

  if (!selectedItem && !selectedNode) {
    return (
      <div className="w-96 border-l border-border bg-card flex items-center justify-center p-8">
        <div className="text-center">
          <Sparkle size={48} weight="duotone" className="text-muted-foreground opacity-30 mx-auto mb-4" />
          <p className="text-sm text-muted-foreground">
            Select a vault item or canvas node to see AI-powered insights
          </p>
        </div>
      </div>
    )
  }

  return (
    <div data-testid="ai-preview-panel" className="w-96 border-l border-border bg-card flex flex-col">
      <div className="p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkle size={20} weight="duotone" className="text-primary" />
          <h3 className="font-semibold text-sm">AI Preview</h3>
        </div>
        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="h-8 w-8"
        >
          ×
        </Button>
      </div>

      <div className="p-4 border-b border-border">
        <div className="flex items-center gap-2 mb-3">
          <Badge variant="outline" className="text-xs">
            {currentType}
          </Badge>
          {isGenerating && (
            <span className="text-xs text-muted-foreground animate-pulse">
              Generating...
            </span>
          )}
        </div>
        
        <ScrollArea className="h-24 rounded-md bg-muted/30 p-3">
          <p className="text-xs text-muted-foreground line-clamp-4">
            {currentContent}
          </p>
        </ScrollArea>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as PreviewMode)} className="flex-1 flex flex-col">
        <TabsList className="mx-4 mt-4 grid grid-cols-4">
          {(['refine', 'expand', 'extract', 'transform'] as PreviewMode[]).map((m) => {
            const config = getModeConfig(m)
            const Icon = config.icon
            return (
              <TabsTrigger 
                key={m} 
                value={m}
                className="flex flex-col gap-1 py-2"
              >
                <Icon size={16} weight="duotone" className={config.color} />
                <span className="text-xs">{config.label}</span>
              </TabsTrigger>
            )
          })}
        </TabsList>

        <div className="flex-1 overflow-hidden mt-4">
          <ScrollArea className="h-full px-4">
            <div className="pb-4">
              {result.content ? (
                <Card className="p-4 border-border relative">
                  {!result.isComplete && (
                    <div className="absolute top-2 right-2">
                      <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                    </div>
                  )}
                  
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <pre className="whitespace-pre-wrap text-sm leading-relaxed">
                      {result.content}
                    </pre>
                  </div>
                  
                  {result.isComplete && (
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={handleCopy}
                        className="flex-1"
                      >
                        {copied ? (
                          <>
                            <CheckCircle size={14} className="mr-1" />
                            Copied
                          </>
                        ) : (
                          <>
                            <Copy size={14} className="mr-1" />
                            Copy
                          </>
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => generatePreview(mode)}
                        disabled={isGenerating}
                      >
                        <ArrowsClockwise size={14} className="mr-1" />
                        Regenerate
                      </Button>
                    </div>
                  )}
                </Card>
              ) : (
                <div className="flex items-center justify-center py-12">
                  <p className="text-sm text-muted-foreground">
                    {isGenerating ? 'Analyzing...' : 'Select a mode to generate preview'}
                  </p>
                </div>
              )}
            </div>
          </ScrollArea>
        </div>
      </Tabs>
    </div>
  )
}
