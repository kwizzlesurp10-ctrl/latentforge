import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'
import { takePercySnapshot, VIEWPORT_PRESETS, prepareForPercy } from './percy-helpers'

test.describe('Theme Comparison Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('compares light vs dark mode - dashboard', async ({ page, context }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Theme Compare - Dashboard Default', VIEWPORT_PRESETS.responsive)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Dashboard Dark Mode', VIEWPORT_PRESETS.responsive)
  })

  test('compares theme in quick capture modal', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Theme Compare - Quick Capture Default', VIEWPORT_PRESETS.responsive)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Quick Capture Dark', VIEWPORT_PRESETS.responsive)
  })

  test('compares button states across themes', async ({ page }) => {
    await page.waitForSelector('button:has-text("Quick Capture")', { state: 'visible' })
    
    const buttonHTML = `
      <div style="padding: 3rem; display: flex; flex-direction: column; gap: 2rem;">
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold glow-primary">Primary Button</button>
          <button class="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold">Secondary Button</button>
          <button class="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold">Accent Button</button>
          <button class="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold">Destructive Button</button>
        </div>
        <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
          <button class="border-2 border-primary text-primary px-6 py-3 rounded-lg font-semibold">Outline Primary</button>
          <button class="border-2 border-secondary text-secondary px-6 py-3 rounded-lg font-semibold">Outline Secondary</button>
          <button class="bg-transparent text-muted-foreground px-6 py-3 rounded-lg font-semibold">Ghost Button</button>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      container.setAttribute('data-theme-test', 'true')
      document.body.appendChild(container)
    }, buttonHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Button Palette Default', VIEWPORT_PRESETS.desktop)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Button Palette Dark', VIEWPORT_PRESETS.desktop)
  })

  test('compares color palette swatches', async ({ page }) => {
    const colorSwatchHTML = `
      <div style="padding: 3rem;">
        <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
          <div>
            <div class="bg-background p-6 rounded-lg border-2 border-border">
              <p class="text-foreground font-bold mb-2">Background</p>
              <p class="text-muted-foreground text-sm">Default page background</p>
            </div>
          </div>
          <div>
            <div class="bg-card p-6 rounded-lg border-2 border-border">
              <p class="text-card-foreground font-bold mb-2">Card</p>
              <p class="text-muted-foreground text-sm">Card backgrounds</p>
            </div>
          </div>
          <div>
            <div class="bg-primary p-6 rounded-lg border-2 border-border">
              <p class="text-primary-foreground font-bold mb-2">Primary</p>
              <p class="text-primary-foreground text-sm opacity-80">Primary actions</p>
            </div>
          </div>
          <div>
            <div class="bg-secondary p-6 rounded-lg border-2 border-border">
              <p class="text-secondary-foreground font-bold mb-2">Secondary</p>
              <p class="text-secondary-foreground text-sm opacity-80">Secondary actions</p>
            </div>
          </div>
          <div>
            <div class="bg-accent p-6 rounded-lg border-2 border-border">
              <p class="text-accent-foreground font-bold mb-2">Accent</p>
              <p class="text-accent-foreground text-sm opacity-80">Accent highlights</p>
            </div>
          </div>
          <div>
            <div class="bg-destructive p-6 rounded-lg border-2 border-border">
              <p class="text-destructive-foreground font-bold mb-2">Destructive</p>
              <p class="text-destructive-foreground text-sm opacity-80">Danger actions</p>
            </div>
          </div>
          <div>
            <div class="bg-muted p-6 rounded-lg border-2 border-border">
              <p class="text-muted-foreground font-bold mb-2">Muted</p>
              <p class="text-muted-foreground text-sm">Subdued content</p>
            </div>
          </div>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, colorSwatchHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Color Palette Default', VIEWPORT_PRESETS.desktop)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Color Palette Dark', VIEWPORT_PRESETS.desktop)
  })

  test('compares typography in both themes', async ({ page }) => {
    const typographyHTML = `
      <div style="padding: 3rem; max-width: 800px;">
        <h1 class="text-4xl font-bold font-display text-foreground mb-4">Display Heading (Space Grotesk)</h1>
        <h2 class="text-3xl font-semibold font-display text-foreground mb-4">Heading 2 (Space Grotesk)</h2>
        <h3 class="text-2xl font-medium font-display text-foreground mb-4">Heading 3 (Space Grotesk)</h3>
        <p class="text-base text-foreground mb-4">
          Body text uses Inter, a highly legible sans-serif designed for screens. This paragraph demonstrates 
          normal body text contrast and readability in the current theme.
        </p>
        <p class="text-sm text-muted-foreground mb-4">
          This is muted text, used for secondary information, timestamps, and metadata. It should be 
          readable but less prominent than primary text.
        </p>
        <code class="font-mono text-sm bg-muted px-2 py-1 rounded">const code = "JetBrains Mono";</code>
        <pre class="font-mono text-sm bg-muted p-4 rounded-lg mt-4">
function example() {
  return "Code blocks use JetBrains Mono";
}
        </pre>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, typographyHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Typography Default', VIEWPORT_PRESETS.desktop)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Typography Dark', VIEWPORT_PRESETS.desktop)
  })

  test('compares form elements in both themes', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await page.fill('input[name="title"]', 'Theme Comparison Test')
    await page.fill('textarea[name="content"]', 'Testing form elements across theme variations')
    
    await takePercySnapshot(page, 'Theme Compare - Form Elements Default', VIEWPORT_PRESETS.responsive)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Form Elements Dark', VIEWPORT_PRESETS.responsive)
  })

  test('compares vault items in both themes', async ({ page }) => {
    const items = [
      { type: 'idea', title: '💡 Theme Test Idea', content: 'Testing theme colors' },
      { type: 'prompt', title: '✨ Theme Prompt', content: 'Generate theme variations' },
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
    
    await page.waitForSelector('[data-testid="vault-item"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Theme Compare - Vault Items Default', VIEWPORT_PRESETS.responsive)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Vault Items Dark', VIEWPORT_PRESETS.responsive)
  })

  test('compares canvas in both themes', async ({ page }) => {
    const canvas = page.locator('[data-testid="forge-canvas"]')
    await canvas.waitFor({ state: 'visible' })
    
    await takePercySnapshot(page, 'Theme Compare - Canvas Default', VIEWPORT_PRESETS.responsive)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Canvas Dark', VIEWPORT_PRESETS.responsive)
  })

  test('compares glow effects in both themes', async ({ page }) => {
    const glowHTML = `
      <div style="padding: 4rem; display: flex; gap: 2rem; flex-wrap: wrap; background: var(--background);">
        <div class="glow-primary bg-primary text-primary-foreground px-8 py-4 rounded-lg font-bold">
          Primary Glow
        </div>
        <div class="glow-secondary bg-secondary text-secondary-foreground px-8 py-4 rounded-lg font-bold">
          Secondary Glow
        </div>
        <div class="glow-accent bg-accent text-accent-foreground px-8 py-4 rounded-lg font-bold">
          Accent Glow
        </div>
        <div class="pulse-glow bg-card border-2 border-primary text-foreground px-8 py-4 rounded-lg font-bold">
          Pulse Glow
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, glowHTML)
    
    await page.addStyleTag({
      content: `
        .pulse-glow { animation: none !important; }
        .glow-primary { animation: none !important; }
        .glow-secondary { animation: none !important; }
        .glow-accent { animation: none !important; }
      `,
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Glow Effects Default', VIEWPORT_PRESETS.desktop)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Glow Effects Dark', VIEWPORT_PRESETS.desktop)
  })

  test('compares mobile layout in both themes', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.waitForSelector('[data-testid="forge-canvas"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Theme Compare - Mobile Default', VIEWPORT_PRESETS.mobile)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Mobile Dark', VIEWPORT_PRESETS.mobile)
  })

  test('compares border and shadow consistency', async ({ page }) => {
    const borderHTML = `
      <div style="padding: 3rem;">
        <div style="display: grid; gap: 2rem; max-width: 600px;">
          <div class="border border-border p-6 rounded-lg">
            <p class="text-foreground font-semibold mb-2">Default Border</p>
            <p class="text-muted-foreground text-sm">Standard border color</p>
          </div>
          <div class="border-2 border-primary p-6 rounded-lg">
            <p class="text-foreground font-semibold mb-2">Primary Border</p>
            <p class="text-muted-foreground text-sm">Highlighted border</p>
          </div>
          <div class="border border-border p-6 rounded-lg shadow-lg">
            <p class="text-foreground font-semibold mb-2">With Shadow</p>
            <p class="text-muted-foreground text-sm">Border + shadow combo</p>
          </div>
          <div class="bg-card border border-border p-6 rounded-lg">
            <p class="text-card-foreground font-semibold mb-2">Card Border</p>
            <p class="text-muted-foreground text-sm">Card background with border</p>
          </div>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, borderHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Borders Default', VIEWPORT_PRESETS.desktop)
    
    await page.evaluate(() => {
      document.documentElement.classList.add('dark')
    })
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Theme Compare - Borders Dark', VIEWPORT_PRESETS.desktop)
  })
})
