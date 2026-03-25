import { UserSettings } from '@/lib/types'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Button } from '@/components/ui/button'
import { Gear, Gauge, Hand, Eye, Keyboard } from '@phosphor-icons/react'
import { toast } from 'sonner'

interface SettingsDialogProps {
  isOpen: boolean
  onClose: () => void
  settings: UserSettings
  onUpdateSettings: (settings: UserSettings) => void
}

export function SettingsDialog({ isOpen, onClose, settings, onUpdateSettings }: SettingsDialogProps) {
  const handleZoomSpeedChange = (value: number[]) => {
    onUpdateSettings({
      ...settings,
      canvas: {
        ...settings.canvas,
        zoomSpeed: value[0],
      },
    })
  }

  const handlePanSensitivityChange = (value: number[]) => {
    onUpdateSettings({
      ...settings,
      canvas: {
        ...settings.canvas,
        panSensitivity: value[0],
      },
    })
  }

  const handleMinimapToggle = (checked: boolean) => {
    onUpdateSettings({
      ...settings,
      ui: {
        ...settings.ui,
        showMinimap: checked,
      },
    })
  }

  const handleGridToggle = (checked: boolean) => {
    onUpdateSettings({
      ...settings,
      ui: {
        ...settings.ui,
        showGrid: checked,
      },
    })
  }

  const handleShortcutsToggle = (checked: boolean) => {
    onUpdateSettings({
      ...settings,
      keyboard: {
        ...settings.keyboard,
        enableShortcuts: checked,
      },
    })
  }

  const handleReset = () => {
    const defaultSettings: UserSettings = {
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
    }
    onUpdateSettings(defaultSettings)
    toast.success('Settings reset to defaults')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2">
            <Gear size={24} weight="duotone" className="text-primary" />
            <DialogTitle className="text-2xl">Settings</DialogTitle>
          </div>
          <DialogDescription>
            Configure your LatentForge experience
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Gauge size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold">Canvas</h3>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="zoom-speed">Zoom Speed</Label>
                  <span className="text-sm text-muted-foreground">{settings.canvas.zoomSpeed.toFixed(1)}×</span>
                </div>
                <Slider
                  id="zoom-speed"
                  min={0.5}
                  max={3}
                  step={0.1}
                  value={[settings.canvas.zoomSpeed]}
                  onValueChange={handleZoomSpeedChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Controls how fast the canvas zooms in/out with scroll
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="pan-sensitivity">Pan Sensitivity</Label>
                  <span className="text-sm text-muted-foreground">{settings.canvas.panSensitivity.toFixed(1)}×</span>
                </div>
                <Slider
                  id="pan-sensitivity"
                  min={0.5}
                  max={2}
                  step={0.1}
                  value={[settings.canvas.panSensitivity]}
                  onValueChange={handlePanSensitivityChange}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground">
                  Controls how responsive panning feels when dragging
                </p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Eye size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold">User Interface</h3>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-minimap">Show Minimap by Default</Label>
                  <p className="text-xs text-muted-foreground">
                    Display the canvas minimap on startup
                  </p>
                </div>
                <Switch
                  id="show-minimap"
                  checked={settings.ui.showMinimap}
                  onCheckedChange={handleMinimapToggle}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="show-grid">Show Grid</Label>
                  <p className="text-xs text-muted-foreground">
                    Display grid dots on canvas background
                  </p>
                </div>
                <Switch
                  id="show-grid"
                  checked={settings.ui.showGrid}
                  onCheckedChange={handleGridToggle}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Keyboard size={20} weight="duotone" className="text-primary" />
              <h3 className="text-lg font-semibold">Keyboard</h3>
            </div>
            
            <div className="space-y-4 pl-7">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label htmlFor="enable-shortcuts">Enable Keyboard Shortcuts</Label>
                  <p className="text-xs text-muted-foreground">
                    Use keyboard shortcuts for quick actions
                  </p>
                </div>
                <Switch
                  id="enable-shortcuts"
                  checked={settings.keyboard.enableShortcuts}
                  onCheckedChange={handleShortcutsToggle}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={handleReset}>
              Reset to Defaults
            </Button>
            <Button onClick={onClose} className="glow-primary">
              Done
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
