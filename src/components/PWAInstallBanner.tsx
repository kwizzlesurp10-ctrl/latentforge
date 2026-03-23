import { useState, useEffect } from 'react'
import { useKV } from '@github/spark/hooks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { X, Download } from '@phosphor-icons/react'
import { motion, AnimatePresence } from 'framer-motion'
import { usePWAInstall } from '@/hooks/use-pwa-install'

export function PWAInstallBanner() {
  const [dismissed, setDismissed] = useKV<boolean>('pwa-install-dismissed', false)
  const { isInstallable, promptInstall} = usePWAInstall()
  const [show, setShow] = useState(false)

  useEffect(() => {
    if (isInstallable && !dismissed) {
      const timer = setTimeout(() => setShow(true), 3000)
      return () => clearTimeout(timer)
    }
  }, [isInstallable, dismissed])

  const handleInstall = async () => {
    const installed = await promptInstall()
    if (installed) {
      setShow(false)
    }
  }

  const handleDismiss = () => {
    setDismissed(() => true)
    setShow(false)
  }

  if (!show || !isInstallable || dismissed) return null

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:max-w-md z-50"
      >
        <Card className="bg-card border-primary/50 shadow-xl glow-primary">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
                <Download size={24} weight="duotone" className="text-primary" />
              </div>
              
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1 font-display">Install LatentForge</h3>
                <p className="text-xs text-muted-foreground mb-3">
                  Get instant access from your home screen. Works offline.
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    onClick={handleInstall}
                    className="glow-hover"
                  >
                    Install App
                  </Button>
                  <Button 
                    size="sm" 
                    variant="ghost" 
                    onClick={handleDismiss}
                  >
                    Not Now
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="icon"
                className="flex-shrink-0 h-6 w-6"
                onClick={handleDismiss}
              >
                <X size={16} />
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </AnimatePresence>
  )
}
