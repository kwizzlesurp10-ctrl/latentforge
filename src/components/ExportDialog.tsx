import { VaultItem, CanvasNode } from '@/lib/types'
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle,
  DialogDescription,
  DialogFooter
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  GithubLogo, 
  NotionLogo, 
  TwitterLogo, 
  FileText, 
  BracketsCurly,
  Copy,
  CheckCircle,
  Download
} from '@phosphor-icons/react'
import { useState, useMemo } from 'react'
import { toast } from 'sonner'
import { Markdown } from '@/components/Markdown'

interface ExportDialogProps {
  isOpen: boolean
  onClose: () => void
  item?: VaultItem | null
  nodes?: CanvasNode[]
}

export function ExportDialog({ isOpen, onClose, item, nodes = [] }: ExportDialogProps) {
  const [activeTab, setActiveTab] = useState('markdown')
  const [copied, setCopied] = useState(false)

  const content = useMemo(() => {
    if (item) return item.content
    return nodes.map(n => n.content).join(`

---

`)
  }, [item, nodes])

  const title = useMemo(() => {
    if (item) return `Export Item #${item.id.split('-')[1]}`
    return `Export ${nodes.length} Canvas Nodes`
  }, [item, nodes])

  const transformations = useMemo(() => {
    const tags = item?.tags || []
    const tagString = tags.length > 0 ? tags.map(t => `#${t}`).join(' ') : ''

    return {
      markdown: `# ${title}

${content}

${tagString}`,
      github: `## ${title}

${content}

---
*Generated via LatentForge* ${tagString}`,
      notion: `${content}

Tags: ${tags.join(', ')}`,
      twitter: `${content.slice(0, 240)}...

${tagString} #LatentForge`,
      json: JSON.stringify(item || nodes, null, 2)
    }
  }, [content, title, item, nodes])

  const handleCopy = async () => {
    const text = (transformations as any)[activeTab]
    await navigator.clipboard.writeText(text)
    setCopied(true)
    toast.success('Export content copied')
    setTimeout(() => setCopied(false), 2000)
  }

  const handleDownload = () => {
    const text = (transformations as any)[activeTab]
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `latentforge-export-${Date.now()}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('File downloaded')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-3xl border-border bg-card glow-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Download size={20} weight="duotone" className="text-primary" />
            Export Arsenal
          </DialogTitle>
          <DialogDescription>
            Transform your latent ideas into living artifacts.
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
          <TabsList className="grid grid-cols-5 mb-4">
            <TabsTrigger value="markdown" className="gap-2">
              <FileText size={16} weight="duotone" />
              <span className="hidden sm:inline">MD</span>
            </TabsTrigger>
            <TabsTrigger value="github" className="gap-2">
              <GithubLogo size={16} weight="duotone" />
              <span className="hidden sm:inline">GitHub</span>
            </TabsTrigger>
            <TabsTrigger value="notion" className="gap-2">
              <NotionLogo size={16} weight="duotone" />
              <span className="hidden sm:inline">Notion</span>
            </TabsTrigger>
            <TabsTrigger value="twitter" className="gap-2">
              <TwitterLogo size={16} weight="duotone" />
              <span className="hidden sm:inline">Tweet</span>
            </TabsTrigger>
            <TabsTrigger value="json" className="gap-2">
              <BracketsCurly size={16} weight="duotone" />
              <span className="hidden sm:inline">JSON</span>
            </TabsTrigger>
          </TabsList>

          <div className="border border-border rounded-md bg-muted/20 p-4">
            <ScrollArea className="h-[300px]">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <pre className="whitespace-pre-wrap text-xs font-mono">
                  {(transformations as any)[activeTab]}
                </pre>
              </div>
            </ScrollArea>
          </div>
        </Tabs>

        <DialogFooter className="flex sm:justify-between items-center gap-2">
          <div className="text-[10px] text-muted-foreground uppercase tracking-widest">
            Format: {activeTab}
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Close</Button>
            <Button variant="secondary" onClick={handleDownload} className="gap-2">
              <Download size={16} />
              Download
            </Button>
            <Button onClick={handleCopy} className="glow-primary min-w-[120px] gap-2">
              {copied ? <CheckCircle size={16} weight="bold" /> : <Copy size={16} weight="bold" />}
              {copied ? 'Copied' : 'Copy Content'}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
