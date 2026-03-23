import { test, expect } from '@playwright/test'
import percySnapshot from '@percy/playwright'
import { prepareForPercy, takePercySnapshot, VIEWPORT_PRESETS } from './percy-helpers'

test.describe('Dark Mode Theme Variations', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('captures cyberpunk dark theme - main dashboard', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Main Dashboard', VIEWPORT_PRESETS.all)
  })

  test('captures dark theme - vault sidebar variations', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Vault Sidebar Open', VIEWPORT_PRESETS.responsive)
    
    const toggleButton = page.locator('button[aria-label="Toggle vault sidebar"]').first()
    await toggleButton.click()
    await page.waitForTimeout(500)
    
    await takePercySnapshot(page, 'Dark Theme - Vault Sidebar Collapsed', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - color palette components', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Quick Capture Modal', VIEWPORT_PRESETS.responsive)
    
    await page.keyboard.press('Escape')
    await page.waitForTimeout(300)
    
    await page.keyboard.press('Meta+/')
    await page.waitForSelector('[role="dialog"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Command Palette', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - primary action buttons', async ({ page }) => {
    await page.waitForSelector('button:has-text("Quick Capture")', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Primary Button Default', VIEWPORT_PRESETS.desktop)
    
    const quickCaptureButton = page.locator('button:has-text("Quick Capture")').first()
    await quickCaptureButton.hover()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Dark Theme - Primary Button Hover', VIEWPORT_PRESETS.desktop)
  })

  test('captures dark theme - glow effects and highlights', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Neon Glow Test')
    await page.fill('textarea[name="content"]', 'Testing cyberpunk neon effects in dark mode')
    
    await takePercySnapshot(page, 'Dark Theme - Input Fields Focus', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - vault items with different types', async ({ page }) => {
    const itemTypes = [
      { type: 'idea', title: '💡 Dark Theme Idea', content: 'Brilliant cyberpunk concept' },
      { type: 'prompt', title: '✨ AI Prompt', content: 'Generate a cyberpunk narrative about...' },
      { type: 'code', title: '⚡ Code Snippet', content: 'const darkTheme = {\n  primary: "oklch(0.65 0.28 330)",\n  glow: true\n};' },
      { type: 'note', title: '📝 Design Notes', content: 'Dark mode needs electric magenta accents' },
    ]

    for (const item of itemTypes) {
      await page.keyboard.press('Meta+k')
      await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
      
      await page.fill('input[name="title"]', item.title)
      await page.fill('textarea[name="content"]', item.content)
      await page.selectOption('select[name="type"]', item.type)
      
      await page.click('button[type="submit"]')
      await page.waitForTimeout(300)
    }
    
    await page.waitForSelector('[data-testid="vault-item"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Vault Items Mixed Types', VIEWPORT_PRESETS.all)
  })

  test('captures dark theme - canvas with nodes and connections', async ({ page }) => {
    const canvas = page.locator('[data-testid="forge-canvas"]')
    await canvas.waitFor({ state: 'visible' })
    
    await canvas.dblclick({ position: { x: 300, y: 200 } })
    await page.waitForTimeout(300)
    
    const titleInput = page.locator('input[placeholder*="title"], input[placeholder*="Title"]').first()
    if (await titleInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await titleInput.fill('Cyberpunk Node 1')
      await page.keyboard.press('Enter')
    }
    
    await page.waitForTimeout(500)
    
    await canvas.dblclick({ position: { x: 600, y: 300 } })
    await page.waitForTimeout(300)
    
    const titleInput2 = page.locator('input[placeholder*="title"], input[placeholder*="Title"]').first()
    if (await titleInput2.isVisible({ timeout: 1000 }).catch(() => false)) {
      await titleInput2.fill('Neon Node 2')
      await page.keyboard.press('Enter')
    }
    
    await page.waitForTimeout(500)
    
    await takePercySnapshot(page, 'Dark Theme - Canvas with Nodes', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - AI preview panel', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Dark Theme Preview Test')
    await page.fill('textarea[name="content"]', 'Testing AI preview panel colors and contrast in dark mode')
    await page.selectOption('select[name="type"]', 'prompt')
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)
    
    const vaultItem = page.locator('[data-testid="vault-item"]').first()
    await vaultItem.click()
    
    await page.waitForSelector('[data-testid="ai-preview-panel"]', { state: 'visible', timeout: 3000 })
    await page.waitForTimeout(1000)
    
    await takePercySnapshot(page, 'Dark Theme - AI Preview Panel Open', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - border and divider colors', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Border Test Item 1')
    await page.fill('textarea[name="content"]', 'Testing border visibility')
    await page.selectOption('select[name="type"]', 'note')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(300)
    
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Border Test Item 2')
    await page.fill('textarea[name="content"]', 'Testing separator lines')
    await page.selectOption('select[name="type"]', 'idea')
    await page.click('button[type="submit"]')
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Dark Theme - Borders and Dividers', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - text contrast levels', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Text Contrast Primary', VIEWPORT_PRESETS.desktop)
    
    await page.fill('input[name="title"]', 'Text Contrast Test')
    await page.fill('textarea[name="content"]', 'Primary text should be highly legible.\n\nSecondary text should be readable but less prominent.\n\nMuted text for metadata and timestamps.')
    
    await takePercySnapshot(page, 'Dark Theme - Text Contrast Filled', VIEWPORT_PRESETS.desktop)
  })

  test('captures dark theme - hover and focus states', async ({ page }) => {
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    const archiveButton = page.locator('button[aria-label="Toggle vault sidebar"]').first()
    await archiveButton.hover()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Dark Theme - Icon Button Hover', VIEWPORT_PRESETS.desktop)
    
    const sparkleButton = page.locator('button:has([data-icon="sparkle"]), button:has-text("AI")').first()
    if (await sparkleButton.count() > 0) {
      await sparkleButton.hover()
      await page.waitForTimeout(200)
      
      await takePercySnapshot(page, 'Dark Theme - Tooltip Visible', VIEWPORT_PRESETS.desktop)
    }
  })

  test('captures dark theme - card and popover backgrounds', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Card Background Test')
    await page.fill('textarea[name="content"]', 'Testing card vs popover background colors')
    await page.selectOption('select[name="type"]', 'idea')
    
    await takePercySnapshot(page, 'Dark Theme - Card Backgrounds', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - accent color variations', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Accent Colors Default', VIEWPORT_PRESETS.desktop)
    
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Accent Test')
    
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.hover()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Dark Theme - Accent Button Hover', VIEWPORT_PRESETS.desktop)
  })

  test('captures dark theme - mobile responsive layouts', async ({ page, isMobile }) => {
    if (!isMobile) {
      await page.setViewportSize({ width: 375, height: 667 })
    }
    
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Mobile Main View', VIEWPORT_PRESETS.mobile)
    
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Dark Theme - Mobile Quick Capture', VIEWPORT_PRESETS.mobile)
  })

  test('captures dark theme - empty state styling', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    await takePercySnapshot(page, 'Dark Theme - Empty State Initial', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - loading and skeleton states', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Loading State Test')
    await page.fill('textarea[name="content"]', 'Testing dark mode loading indicators')
    await page.selectOption('select[name="type"]', 'prompt')
    
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Dark Theme - Loading State Active', VIEWPORT_PRESETS.desktop)
  })

  test('captures dark theme - destructive actions', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Delete Test Item')
    await page.fill('textarea[name="content"]', 'This item will test delete button styling')
    await page.selectOption('select[name="type"]', 'note')
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)
    
    const vaultItem = page.locator('[data-testid="vault-item"]').first()
    await vaultItem.hover()
    await page.waitForTimeout(300)
    
    const deleteButton = vaultItem.locator('button[aria-label*="Delete"], button:has([data-icon="trash"])').first()
    if (await deleteButton.count() > 0) {
      await deleteButton.hover()
      await page.waitForTimeout(200)
      
      await takePercySnapshot(page, 'Dark Theme - Destructive Button Hover', VIEWPORT_PRESETS.desktop)
    }
  })

  test('captures dark theme - form validation states', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Dark Theme - Form Validation Errors', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - selected and active states', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Selection Test Item')
    await page.fill('textarea[name="content"]', 'Testing selected state colors')
    await page.selectOption('select[name="type"]', 'idea')
    
    await page.click('button[type="submit"]')
    await page.waitForTimeout(500)
    
    const vaultItem = page.locator('[data-testid="vault-item"]').first()
    await vaultItem.click()
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Dark Theme - Selected Item State', VIEWPORT_PRESETS.responsive)
  })

  test('captures dark theme - typography hierarchy', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Typography Hierarchy Test')
    await page.fill('textarea[name="content"]', '# Heading 1\n\n## Heading 2\n\n### Heading 3\n\nBody text with **bold** and *italic* formatting.\n\n`code inline` and more text.\n\n> Blockquote text\n\n- List item 1\n- List item 2')
    await page.selectOption('select[name="type"]', 'note')
    
    await takePercySnapshot(page, 'Dark Theme - Typography Hierarchy', VIEWPORT_PRESETS.desktop)
  })

  test('captures dark theme - secondary action buttons', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    const toggleButton = page.locator('button[aria-label="Toggle vault sidebar"]').first()
    await toggleButton.hover()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Dark Theme - Secondary Button Default', VIEWPORT_PRESETS.desktop)
  })

  test('captures dark theme - full app layout composition', async ({ page }) => {
    const items = [
      { type: 'idea', title: '🚀 Launch Feature', content: 'New moonshot idea' },
      { type: 'prompt', title: '✨ AI Generation', content: 'Generate cyberpunk story' },
      { type: 'code', title: '⚡ Quick Script', content: 'const magic = true;' },
    ]

    for (const item of items) {
      await page.keyboard.press('Meta+k')
      await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
      
      await page.fill('input[name="title"]', item.title)
      await page.fill('textarea[name="content"]', item.content)
      await page.selectOption('select[name="type"]', item.type)
      
      await page.click('button[type="submit"]')
      await page.waitForTimeout(300)
    }
    
    const canvas = page.locator('[data-testid="forge-canvas"]')
    await canvas.dblclick({ position: { x: 400, y: 250 } })
    await page.waitForTimeout(300)
    
    const titleInput = page.locator('input[placeholder*="title"], input[placeholder*="Title"]').first()
    if (await titleInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await titleInput.fill('Dark Theme Canvas Node')
      await page.keyboard.press('Enter')
    }
    
    await page.waitForTimeout(500)
    
    await takePercySnapshot(page, 'Dark Theme - Full Layout Composition', VIEWPORT_PRESETS.all)
  })

  test('captures dark theme - keyboard shortcut indicators', async ({ page }) => {
    await page.waitForSelector('button:has-text("Quick Capture")', { state: 'visible' })
    
    const shortcutSpan = page.locator('span:has-text("⌘K"), span:has-text("⌘/")').first()
    if (await shortcutSpan.count() > 0) {
      await takePercySnapshot(page, 'Dark Theme - Keyboard Shortcuts Visible', VIEWPORT_PRESETS.desktop)
    }
  })

  test('captures dark theme - contrast ratios for accessibility', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    await page.evaluate(() => {
      const contrastTest = document.createElement('div')
      contrastTest.innerHTML = `
        <div style="padding: 2rem;">
          <h1 class="text-foreground">Primary Foreground Text</h1>
          <p class="text-muted-foreground">Muted Foreground Text</p>
          <button class="bg-primary text-primary-foreground px-4 py-2 rounded">Primary Button</button>
          <button class="bg-secondary text-secondary-foreground px-4 py-2 rounded ml-2">Secondary Button</button>
          <button class="bg-accent text-accent-foreground px-4 py-2 rounded ml-2">Accent Button</button>
          <button class="bg-destructive text-destructive-foreground px-4 py-2 rounded ml-2">Destructive Button</button>
        </div>
      `
      document.body.appendChild(contrastTest)
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Dark Theme - Contrast Ratios WCAG', VIEWPORT_PRESETS.desktop)
  })
})
