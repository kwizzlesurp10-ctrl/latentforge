import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { VaultItem } from '@/lib/types'
import { Lightning, X } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface QuickCaptureProps {
  isOpen: boolean
  onClose: () => void
  onSave: (item: Omit<VaultItem, 'id' | 'createdAt' | 'updatedAt' | 'version'>) => void
}

const SUGGESTED_TAGS = ['idea', 'code', 'prompt', 'research', 'design', 'bug', 'feature']

export function QuickCapture({ isOpen, onClose, onSave }: QuickCaptureProps) {
  const [content, setContent] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [newTag, setNewTag] = useState('')

  useEffect(() => {
    if (!isOpen) {
      setContent('')
      setTags([])
      setNewTag('')
    }
  }, [isOpen])

  const detectType = (text: string): VaultItem['type'] => {
    if (text.match(/```|function |const |let |var |import |export /)) {
      return 'code'
    }
    if (text.match(/^(generate|create|write|explain|analyze)/i)) {
      return 'prompt'
    }
    return 'text'
  }

  const handleSave = () => {
    if (!content.trim()) {
      toast.error('Content cannot be empty')
      return
    }

    const type = detectType(content)
    
    onSave({
      content: content.trim(),
      type,
      tags,
    })

    toast.success('Captured to Shadow Vault', {
      description: `Type: ${type} | ${tags.length} tags`,
      className: 'glow-primary',
    })

    onClose()
  }

  const addTag = (tag: string) => {
    const normalized = tag.trim().toLowerCase()
    if (normalized && !tags.includes(normalized)) {
      setTags([...tags, normalized])
      setNewTag('')
    }
  }

  const removeTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
      e.preventDefault()
      handleSave()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent data-testid="quick-capture-dialog" className="sm:max-w-2xl glow-primary">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-primary">
            <Lightning size={24} weight="duotone" />
            Quick Capture
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <Textarea
            placeholder="Capture your thought, paste code, drop a prompt..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            className="min-h-[200px] font-mono text-sm resize-none border-primary/30 focus:border-primary"
            autoFocus
          />

          <div>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="text"
                placeholder="Add tag..."
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    addTag(newTag)
                  }
                }}
                className="flex-1 px-3 py-1.5 text-sm border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-ring"
              />
              <Button
                size="sm"
                variant="secondary"
                onClick={() => addTag(newTag)}
                disabled={!newTag.trim()}
              >
                Add
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="default"
                  className="px-3 py-1 cursor-pointer hover:bg-destructive/80 transition-colors"
                  onClick={() => removeTag(tag)}
                >
                  {tag}
                  <X size={12} className="ml-1" weight="bold" />
                </Badge>
              ))}
            </div>

            {tags.length === 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                <span className="text-xs text-muted-foreground">Suggested:</span>
                {SUGGESTED_TAGS.map((tag) => (
                  <Badge
                    key={tag}
                    variant="outline"
                    className="cursor-pointer hover:bg-secondary/50 transition-colors"
                    onClick={() => addTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="glow-primary">
              Capture
              <span className="ml-2 text-xs opacity-70">⌘↵</span>
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
