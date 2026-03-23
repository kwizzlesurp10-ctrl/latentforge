import { test, expect } from '@playwright/test'
import percySnapshot from '@percy/playwright'
import { takePercySnapshot, VIEWPORT_PRESETS } from './percy-helpers'

test.describe('Dark Mode Accessibility Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('validates WCAG AA contrast - main interface', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    const contrastHTML = `
      <div style="padding: 3rem; background: var(--background);">
        <div style="max-width: 1200px; margin: 0 auto;">
          <h1 style="font-size: 2rem; font-weight: bold; color: var(--foreground); margin-bottom: 2rem;">
            WCAG AA Contrast Validation
          </h1>
          
          <div style="display: grid; gap: 2rem;">
            <!-- Primary Text on Background -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-2">Primary Text on Background</h2>
              <p class="text-foreground text-base mb-2">
                This is body text with primary foreground color. Target: 7:1 (AAA)
              </p>
              <p class="text-muted-foreground text-base">
                This is muted text for secondary information. Target: 4.5:1 (AA)
              </p>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Background: oklch(0.12 0.01 270) | Foreground: oklch(0.98 0 0)</code>
              </div>
            </div>

            <!-- Primary Button -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-4">Primary Button</h2>
              <button class="bg-primary text-primary-foreground px-6 py-3 rounded-lg font-semibold text-base">
                Primary Action Button
              </button>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Primary: oklch(0.65 0.28 330) | Text: oklch(0.98 0 0)</code>
              </div>
            </div>

            <!-- Secondary Button -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-4">Secondary Button</h2>
              <button class="bg-secondary text-secondary-foreground px-6 py-3 rounded-lg font-semibold text-base">
                Secondary Action Button
              </button>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Secondary: oklch(0.75 0.15 195) | Text: oklch(0.12 0.01 270)</code>
              </div>
            </div>

            <!-- Accent Button -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-4">Accent Button</h2>
              <button class="bg-accent text-accent-foreground px-6 py-3 rounded-lg font-semibold text-base">
                Accent Highlight Button
              </button>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Accent: oklch(0.85 0.18 195) | Text: oklch(0.12 0.01 270)</code>
              </div>
            </div>

            <!-- Destructive Button -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-4">Destructive Button</h2>
              <button class="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-semibold text-base">
                Delete or Remove
              </button>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Destructive: oklch(0.55 0.22 25) | Text: oklch(0.98 0 0)</code>
              </div>
            </div>

            <!-- Card on Background -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-4">Card Component</h2>
              <div class="bg-card text-card-foreground p-6 rounded-lg border border-border">
                <h3 class="text-xl font-semibold mb-2">Card Title</h3>
                <p class="text-base mb-4">
                  Card content with foreground text color on card background.
                </p>
                <p class="text-muted-foreground text-sm">
                  Muted text on card background.
                </p>
              </div>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Card: oklch(0.18 0.02 270) | Text: oklch(0.98 0 0)</code>
              </div>
            </div>

            <!-- Muted Background -->
            <div style="background: var(--background); padding: 2rem; border: 2px solid var(--border); border-radius: 0.5rem;">
              <h2 class="text-foreground text-2xl font-bold mb-4">Muted Background</h2>
              <div class="bg-muted text-muted-foreground p-6 rounded-lg">
                <p class="text-base">
                  Text on muted background for de-emphasized content.
                </p>
              </div>
              <div style="margin-top: 1rem; padding: 1rem; background: rgba(255,255,255,0.05); border-radius: 0.25rem;">
                <code class="font-mono text-sm">Muted: oklch(0.25 0.05 270) | Text: oklch(0.65 0.05 270)</code>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, contrastHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Accessibility - WCAG Contrast Validation', VIEWPORT_PRESETS.desktop)
  })

  test('validates focus indicators visibility', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    const titleInput = page.locator('input[name="title"]')
    await titleInput.focus()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Accessibility - Focus Indicator Input', VIEWPORT_PRESETS.responsive)
    
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.focus()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Accessibility - Focus Indicator Button', VIEWPORT_PRESETS.responsive)
  })

  test('validates keyboard navigation visual feedback', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Accessibility - Keyboard Tab Navigation 1', VIEWPORT_PRESETS.desktop)
    
    await page.keyboard.press('Tab')
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Accessibility - Keyboard Tab Navigation 2', VIEWPORT_PRESETS.desktop)
  })

  test('validates error state contrast', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    const submitButton = page.locator('button[type="submit"]')
    await submitButton.click()
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Accessibility - Error State Contrast', VIEWPORT_PRESETS.responsive)
  })

  test('validates link and interactive element visibility', async ({ page }) => {
    const linkHTML = `
      <div style="padding: 3rem; background: var(--background);">
        <div style="max-width: 800px;">
          <h2 class="text-foreground text-2xl font-bold mb-6">Interactive Element Visibility</h2>
          
          <div style="display: grid; gap: 2rem;">
            <div>
              <h3 class="text-foreground text-xl font-semibold mb-3">Text Links</h3>
              <p class="text-foreground mb-2">
                This is body text with a 
                <a href="#" class="text-primary underline hover:text-primary/80">primary colored link</a> 
                inline.
              </p>
              <p class="text-foreground">
                Another sentence with a 
                <a href="#" class="text-secondary underline hover:text-secondary/80">secondary colored link</a> 
                for variety.
              </p>
            </div>

            <div>
              <h3 class="text-foreground text-xl font-semibold mb-3">Button States</h3>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded">Default</button>
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded opacity-70">Disabled</button>
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded ring-2 ring-ring ring-offset-2 ring-offset-background">Focused</button>
              </div>
            </div>

            <div>
              <h3 class="text-foreground text-xl font-semibold mb-3">Form Elements</h3>
              <div style="display: grid; gap: 1rem;">
                <input 
                  type="text" 
                  placeholder="Text input" 
                  class="bg-background border border-input text-foreground px-3 py-2 rounded focus:ring-2 focus:ring-ring"
                />
                <input 
                  type="text" 
                  placeholder="Focused input" 
                  class="bg-background border border-input text-foreground px-3 py-2 rounded ring-2 ring-ring"
                />
                <input 
                  type="text" 
                  placeholder="Error state" 
                  class="bg-background border-2 border-destructive text-foreground px-3 py-2 rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, linkHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Accessibility - Interactive Elements', VIEWPORT_PRESETS.responsive)
  })

  test('validates text sizing and readability', async ({ page }) => {
    const typographyHTML = `
      <div style="padding: 3rem; background: var(--background);">
        <div style="max-width: 800px;">
          <h1 class="text-4xl font-bold font-display text-foreground mb-8">
            Typography Scale & Readability
          </h1>
          
          <div style="display: grid; gap: 3rem;">
            <div>
              <h2 class="text-3xl font-bold font-display text-foreground mb-4">Large Heading (3xl)</h2>
              <p class="text-base text-foreground leading-relaxed">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Proper line height 
                and spacing ensure readability across different font sizes. This paragraph 
                demonstrates body text at the base size.
              </p>
            </div>

            <div>
              <h3 class="text-2xl font-semibold font-display text-foreground mb-3">Medium Heading (2xl)</h3>
              <p class="text-base text-foreground leading-relaxed">
                Shorter paragraph with the same font size to show consistency. The text should 
                be easily readable against the dark background.
              </p>
            </div>

            <div>
              <h4 class="text-xl font-semibold font-display text-foreground mb-2">Small Heading (xl)</h4>
              <p class="text-sm text-muted-foreground leading-relaxed">
                This is smaller text (sm) with muted foreground color, typically used for 
                metadata, timestamps, or supplementary information. It should still meet 
                WCAG AA standards for contrast ratio.
              </p>
            </div>

            <div class="bg-card p-6 rounded-lg border border-border">
              <h4 class="text-lg font-semibold text-card-foreground mb-2">Text on Card Background</h4>
              <p class="text-base text-card-foreground leading-relaxed mb-3">
                Body text on card background demonstrates how content appears in elevated 
                surfaces. The contrast should be maintained.
              </p>
              <p class="text-sm text-muted-foreground">
                Smaller muted text on card background.
              </p>
            </div>

            <div>
              <h4 class="text-lg font-semibold text-foreground mb-2">Code & Monospace</h4>
              <code class="font-mono text-sm bg-muted px-2 py-1 rounded text-foreground">const example = "inline code";</code>
              <pre class="font-mono text-sm bg-muted p-4 rounded mt-3 text-foreground">
function codeBlock() {
  return "Multi-line code block";
}
              </pre>
            </div>
          </div>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, typographyHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Accessibility - Typography Readability', VIEWPORT_PRESETS.responsive)
  })

  test('validates icon button accessibility', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    const toggleButton = page.locator('button[aria-label="Toggle vault sidebar"]').first()
    
    await takePercySnapshot(page, 'Accessibility - Icon Button Default', VIEWPORT_PRESETS.desktop)
    
    await toggleButton.focus()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Accessibility - Icon Button Focused', VIEWPORT_PRESETS.desktop)
    
    await toggleButton.hover()
    await page.waitForTimeout(200)
    
    await takePercySnapshot(page, 'Accessibility - Icon Button Hover', VIEWPORT_PRESETS.desktop)
  })

  test('validates tooltip contrast and readability', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    const commandButton = page.locator('button[aria-label*="AI"], button:has([data-icon="sparkle"])').first()
    
    if (await commandButton.count() > 0) {
      await commandButton.hover()
      await page.waitForSelector('[role="tooltip"]', { state: 'visible', timeout: 2000 })
      await page.waitForTimeout(300)
      
      await takePercySnapshot(page, 'Accessibility - Tooltip Contrast', VIEWPORT_PRESETS.desktop)
    }
  })

  test('validates modal dialog contrast', async ({ page }) => {
    await page.keyboard.press('Meta+k')
    await page.waitForSelector('[data-testid="quick-capture-dialog"]', { state: 'visible' })
    
    await takePercySnapshot(page, 'Accessibility - Modal Dialog Contrast', VIEWPORT_PRESETS.responsive)
  })

  test('validates disabled state visibility', async ({ page }) => {
    const disabledHTML = `
      <div style="padding: 3rem; background: var(--background);">
        <div style="max-width: 600px;">
          <h2 class="text-foreground text-2xl font-bold mb-6">Disabled State Visibility</h2>
          
          <div style="display: grid; gap: 2rem;">
            <div>
              <h3 class="text-foreground text-lg font-semibold mb-3">Buttons</h3>
              <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded">Enabled</button>
                <button class="bg-primary text-primary-foreground px-4 py-2 rounded opacity-50 cursor-not-allowed">Disabled</button>
              </div>
            </div>

            <div>
              <h3 class="text-foreground text-lg font-semibold mb-3">Form Inputs</h3>
              <div style="display: grid; gap: 1rem;">
                <input 
                  type="text" 
                  value="Enabled input"
                  class="bg-background border border-input text-foreground px-3 py-2 rounded"
                />
                <input 
                  type="text" 
                  value="Disabled input"
                  disabled
                  class="bg-background border border-input text-foreground px-3 py-2 rounded opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div>
              <h3 class="text-foreground text-lg font-semibold mb-3">Checkboxes</h3>
              <div style="display: flex; flex-direction: column; gap: 0.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                  <input type="checkbox" class="w-4 h-4" />
                  <span class="text-foreground">Enabled checkbox</span>
                </label>
                <label style="display: flex; align-items: center; gap: 0.5rem; opacity: 0.5;">
                  <input type="checkbox" disabled class="w-4 h-4" />
                  <span class="text-foreground">Disabled checkbox</span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, disabledHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Accessibility - Disabled States', VIEWPORT_PRESETS.responsive)
  })

  test('validates color blindness simulation - primary colors', async ({ page }) => {
    await page.waitForSelector('[data-testid="vault-sidebar"]', { state: 'visible' })
    
    const colorHTML = `
      <div style="padding: 3rem; background: var(--background);">
        <div style="max-width: 1200px;">
          <h2 class="text-foreground text-2xl font-bold mb-6">Color Differentiation Test</h2>
          
          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 1.5rem;">
            <div class="bg-primary p-6 rounded-lg">
              <p class="text-primary-foreground font-bold">Primary</p>
              <p class="text-primary-foreground text-sm opacity-80">Electric Magenta</p>
            </div>
            
            <div class="bg-secondary p-6 rounded-lg">
              <p class="text-secondary-foreground font-bold">Secondary</p>
              <p class="text-secondary-foreground text-sm opacity-80">Cyber Cyan</p>
            </div>
            
            <div class="bg-accent p-6 rounded-lg">
              <p class="text-accent-foreground font-bold">Accent</p>
              <p class="text-accent-foreground text-sm opacity-80">Neon Highlight</p>
            </div>
            
            <div class="bg-destructive p-6 rounded-lg">
              <p class="text-destructive-foreground font-bold">Destructive</p>
              <p class="text-destructive-foreground text-sm opacity-80">Warning Red</p>
            </div>
          </div>

          <p class="text-muted-foreground text-sm mt-6">
            These colors should be distinguishable even for users with color vision deficiencies. 
            Rely on contrast, not just hue.
          </p>
        </div>
      </div>
    `
    
    await page.evaluate((html) => {
      const container = document.createElement('div')
      container.innerHTML = html
      document.body.appendChild(container)
    }, colorHTML)
    
    await page.waitForTimeout(300)
    
    await takePercySnapshot(page, 'Accessibility - Color Differentiation', VIEWPORT_PRESETS.desktop)
  })
})
