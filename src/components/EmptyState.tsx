import { motion } from 'framer-motion'
import { Sparkle, Archive, GitBranch, Lightning } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

interface EmptyStateProps {
  type: 'vault' | 'canvas' | 'timeline'
  onAction?: () => void
}

export function EmptyState({ type, onAction }: EmptyStateProps) {
  const config = {
    vault: {
      icon: Archive,
      title: 'Your Vault Awaits',
      description: 'Capture fleeting thoughts before they dissolve into the digital void. Your first idea could change everything.',
      action: 'Quick Capture',
      shortcut: '⌘K',
      features: [
        'Auto-tagging with AI semantic clustering',
        'Version history with git-like diffs',
        'Drag & drop files, code, screenshots',
      ],
    },
    canvas: {
      icon: Sparkle,
      title: 'Infinite Canvas, Infinite Possibilities',
      description: 'Non-linear thinking space where ideas connect organically. Traditional documents are linear prisons.',
      action: 'Create First Node',
      shortcut: 'Click anywhere',
      features: [
        'Text, code, images, mindmaps in one space',
        'Real-time AI co-pilot for refinement',
        'Lasso selection for multi-item prompting',
      ],
    },
    timeline: {
      icon: GitBranch,
      title: 'Your Creative Timeline',
      description: 'Ideas don\'t evolve linearly. See how your thoughts mutate across sessions, resurrect dead branches.',
      action: 'Start Creating',
      shortcut: '⌘K',
      features: [
        'Visual branching of all idea mutations',
        'Resurrect abandoned concepts',
        'Merge timelines like adversarial git',
      ],
    },
  }

  const { icon: Icon, title, description, action, shortcut, features } = config[type]

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full"
      >
        <Card className="border-primary/30 bg-card/50 backdrop-blur-sm">
          <CardContent className="p-8 md:p-12">
            <div className="flex flex-col items-center text-center space-y-6">
              <motion.div
                className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center pulse-glow"
                animate={{
                  scale: [1, 1.05, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: 'easeInOut',
                }}
              >
                <Icon size={40} weight="duotone" className="text-primary" />
              </motion.div>

              <div className="space-y-3">
                <h2 className="text-3xl font-bold font-display bg-gradient-to-r from-primary via-secondary to-accent bg-clip-text text-transparent">
                  {title}
                </h2>
                <p className="text-lg text-muted-foreground max-w-md mx-auto leading-relaxed">
                  {description}
                </p>
              </div>

              {onAction && (
                <Button
                  size="lg"
                  onClick={onAction}
                  className="glow-primary gap-2 text-base px-8 py-6"
                >
                  <Lightning size={20} weight="fill" />
                  {action}
                  <span className="ml-2 text-xs opacity-70">{shortcut}</span>
                </Button>
              )}

              <div className="pt-6 border-t border-border/50 w-full">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide mb-4">
                  What You Can Do
                </h3>
                <ul className="space-y-3 text-left max-w-md mx-auto">
                  {features.map((feature, index) => (
                    <motion.li
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 + index * 0.1 }}
                      className="flex items-start gap-3 text-sm text-foreground/80"
                    >
                      <Sparkle size={16} weight="fill" className="text-secondary shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-4 text-xs text-muted-foreground">
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">⌘K</span>
                  <span>Quick Capture</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">⌘/</span>
                  <span>Command Palette</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-muted px-2 py-1 rounded">⌘T</span>
                  <span>Timeline</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  )
}
