import { test, expect } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test.describe('Visual Regression Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('captures main dashboard with vault sidebar', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Dashboard - Vault Open', {
      widths: [375, 768, 1280, 1920],
    })
  })

  test('captures dashboard with collapsed vault', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    const toggleButton = page.locator('button[aria-label="Toggle vault sidebar"]').first()
    await toggleButton.click()
    
    await page.waitForTimeout(500)
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Dashboard - Vault Collapsed', {
      widths: [768, 1280, 1920],
    })
  })

  test('captures quick capture modal', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Quick Capture Modal', {
      widths: [375, 768, 1280],
    })
  })

  test('captures command palette', async ({ page }) => {
    await page.keyboard.press('Meta+/')
    
    await page.waitForSelector('[role="dialog"]', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Command Palette', {
      widths: [375, 768, 1280],
    })
  })

  test('captures vault with items', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Visual Test Idea')
    await page.fill('textarea[name="content"]', 'This is a test idea for visual regression testing')
    
    await page.selectOption('select[name="type"]', 'idea')
    
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(500)
    
    await page.waitForSelector('[data-testid="vault-item"]', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Vault - With Items', {
      widths: [375, 768, 1280],
    })
  })

  test('captures canvas with nodes', async ({ page }) => {
    const canvas = page.locator('[data-testid="forge-canvas"]')
    await canvas.waitFor({ state: 'visible' })
    
    await canvas.dblclick({ position: { x: 200, y: 200 } })
    
    await page.waitForTimeout(300)
    
    const titleInput = page.locator('input[placeholder*="title"], input[placeholder*="Title"]').first()
    if (await titleInput.isVisible({ timeout: 1000 }).catch(() => false)) {
      await titleInput.fill('Visual Test Node')
      await page.keyboard.press('Enter')
    }
    
    await page.waitForTimeout(500)
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Canvas - With Nodes', {
      widths: [768, 1280, 1920],
    })
  })

  test('captures AI preview panel', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'AI Preview Test')
    await page.fill('textarea[name="content"]', 'Testing the AI preview panel with visual regression')
    await page.selectOption('select[name="type"]', 'prompt')
    
    await page.click('button[type="submit"]')
    
    await page.waitForTimeout(500)
    
    const vaultItem = page.locator('[data-testid="vault-item"]').first()
    await vaultItem.click()
    
    await page.waitForSelector('[data-testid="ai-preview-panel"]', { state: 'visible', timeout: 3000 })
    
    await page.waitForTimeout(1000)
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'AI Preview Panel - Open', {
      widths: [768, 1280, 1920],
    })
  })

  test('captures mobile navigation', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'Mobile-only test')
    
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Mobile - Main View', {
      widths: [375],
    })
  })

  test('captures empty states', async ({ page }) => {
    await page.evaluate(() => {
      localStorage.clear()
      sessionStorage.clear()
    })
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Empty State - First Load', {
      widths: [768, 1280],
    })
  })

  test('captures vault item types', async ({ page }) => {
    const itemTypes = [
      { type: 'idea', title: 'Idea Item', content: 'A brilliant idea' },
      { type: 'prompt', title: 'Prompt Item', content: 'Generate a story about...' },
      { type: 'code', title: 'Code Snippet', content: 'const x = 10;\nconsole.log(x);' },
      { type: 'note', title: 'Note Item', content: 'Important notes here' },
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
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Vault - All Item Types', {
      widths: [375, 768, 1280],
    })
  })

  test('captures theme consistency', async ({ page }) => {
    await page.waitForSelector('body', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Theme - Cyberpunk Dark', {
      widths: [768, 1280],
    })
  })

  test('captures loading states', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Loading Test')
    await page.fill('textarea[name="content"]', 'Testing loading states')
    await page.selectOption('select[name="type"]', 'prompt')
    
    const submitButton = page.locator('button[type="submit"]')
    
    await page.route('**/api/**', async route => {
      await new Promise(resolve => setTimeout(resolve, 2000))
      await route.continue()
    })
    
    await submitButton.click()
    
    await page.waitForTimeout(200)
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Loading State - Form Submission', {
      widths: [768, 1280],
    })
  })

  test('captures hover states on interactive elements', async ({ page }) => {
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    const quickCaptureButton = page.locator('button:has-text("Quick Capture")').first()
    await quickCaptureButton.hover()
    
    await page.waitForTimeout(200)
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Interactive - Button Hover State', {
      widths: [1280],
    })
  })

  test('captures keyboard shortcut tooltips', async ({ page }) => {
    const commandButton = page.locator('button[aria-label*="AI"], button:has([data-icon="sparkle"])').first()
    await commandButton.hover()
    
    await page.waitForSelector('[role="tooltip"]', { state: 'visible', timeout: 2000 })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Tooltips - Keyboard Shortcuts', {
      widths: [1280],
    })
  })

  test('captures responsive canvas layout', async ({ page, viewport }) => {
    if (viewport && viewport.width < 768) {
      test.skip(true, 'Desktop-only test')
    }
    
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    await page.evaluate(() => {
      document.body.setAttribute('data-percy-ready', 'true')
    })
    
    await percySnapshot(page, 'Canvas - Responsive Layout', {
      widths: [768, 1024, 1280, 1920],
    })
  })
})
