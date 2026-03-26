import { marked } from 'marked'
import { cn } from '@/lib/utils'

interface MarkdownProps {
  content: string
  className?: string
  preview?: boolean
}

export function Markdown({ content, className, preview }: MarkdownProps) {
  // Simple markdown parsing with marked
  // In a production environment, you should use DOMPurify to sanitize the HTML
  const html = marked.parse(content || '')

  return (
    <div 
      className={cn(
        'prose prose-sm dark:prose-invert max-w-none break-words',
        'prose-headings:font-display prose-headings:font-bold prose-headings:tracking-tight',
        'prose-a:text-primary hover:prose-a:underline',
        'prose-code:font-mono prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-muted/50 prose-pre:border prose-pre:border-border',
        preview && 'prose-p:mt-0 prose-p:mb-0 line-clamp-3',
        className
      )}
      dangerouslySetInnerHTML={{ __html: html as string }}
    />
  )
}
