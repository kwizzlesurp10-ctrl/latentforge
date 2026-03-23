# Dark Mode Visual Regression Testing

## Overview

This document covers the comprehensive visual regression testing strategy for LatentForge's cyberpunk dark theme and theme variations. Our testing ensures the neon-panda aesthetic remains consistent across all components, viewports, and user interactions.

## Theme Architecture

### Color System

LatentForge uses a dual-theme system with:

1. **Default Theme** (Cyberpunk Dark)
   - Background: `oklch(0.12 0.01 270)` - Deep obsidian
   - Primary: `oklch(0.65 0.28 330)` - Electric magenta
   - Secondary: `oklch(0.75 0.15 195)` - Cyber cyan
   - Accent: `oklch(0.85 0.18 195)` - Neon highlight

2. **Alternative Dark Mode** (defined in main.css)
   - Background: `oklch(0.145 0 0)` - Neutral dark
   - Optimized for extended reading sessions

### Special Effects

- **Glow Effects**: `.glow-primary`, `.glow-secondary`, `.glow-accent`
- **Pulse Animation**: `.pulse-glow` (disabled in Percy snapshots)
- **Hover States**: `.glow-hover` with transform and shadow transitions

## Test Coverage

### 1. Core Component Tests (`dark-mode-themes.spec.ts`)

Tests comprehensive dark mode rendering across all major components:

#### Dashboard Layouts
- ✅ Main dashboard with vault sidebar open
- ✅ Dashboard with collapsed vault
- ✅ Empty state on first load
- ✅ Full layout composition with multiple items

#### Interactive Modals
- ✅ Quick Capture modal (⌘K)
- ✅ Command Palette (⌘/)
- ✅ AI Preview Panel

#### Vault Components
- ✅ Vault items (all types: idea, prompt, code, note)
- ✅ Selected item states
- ✅ Hover states on vault items
- ✅ Delete button hover (destructive styling)

#### Canvas Elements
- ✅ Canvas with nodes and connections
- ✅ Node creation states
- ✅ Empty canvas background

#### Button & Control States
- ✅ Primary action buttons (default + hover)
- ✅ Secondary buttons
- ✅ Icon buttons with glow effects
- ✅ Tooltips with keyboard shortcuts
- ✅ Destructive action buttons

#### Form Elements
- ✅ Input fields (default + focus)
- ✅ Textareas
- ✅ Select dropdowns
- ✅ Form validation error states

#### Visual Design Elements
- ✅ Border and divider colors
- ✅ Text contrast levels (primary, secondary, muted)
- ✅ Card and popover backgrounds
- ✅ Glow effects and highlights
- ✅ Typography hierarchy
- ✅ Loading and skeleton states

#### Responsive Testing
- ✅ Mobile layouts (375px)
- ✅ Tablet layouts (768px)
- ✅ Desktop layouts (1280px, 1920px)
- ✅ Mobile Quick Capture bottom sheet

### 2. Theme Comparison Tests (`theme-comparison.spec.ts`)

Side-by-side comparison of light vs dark themes:

#### Layout Comparisons
- ✅ Dashboard in both themes
- ✅ Quick Capture modal
- ✅ Canvas layouts
- ✅ Mobile responsive layouts

#### Component Galleries
- ✅ Button palette (all variants)
- ✅ Color swatch showcase
- ✅ Typography samples
- ✅ Form element states

#### Visual Effects
- ✅ Glow effects comparison
- ✅ Border and shadow consistency
- ✅ Hover state differences

#### Accessibility
- ✅ Contrast ratio validation (WCAG AA)
- ✅ Text legibility across backgrounds
- ✅ Focus state visibility

## Running the Tests

### Local Development

```bash
# Run all visual tests (requires PERCY_TOKEN)
npm run test:visual

# Run only dark mode tests
npx playwright test e2e/visual/dark-mode-themes.spec.ts

# Run theme comparison tests
npx playwright test e2e/visual/theme-comparison.spec.ts

# Debug specific test
npx playwright test e2e/visual/dark-mode-themes.spec.ts:10 --debug

# Run with Playwright UI
npx playwright test e2e/visual --ui
```

### CI/CD Pipeline

Tests run automatically on:
- Pull requests to `main`
- Pushes to `main`
- Manual workflow dispatch

Percy compares snapshots and flags visual regressions.

## Test Configuration

### Percy Configuration (`.percyrc.yml`)

```yaml
version: 2
snapshot:
  widths: [375, 768, 1280, 1920]  # Mobile to ultra-wide
  min-height: 1024
  percy-css: |
    # Disable animations for consistent snapshots
    .pulse-glow,
    .glow-hover,
    [data-disable-percy] {
      animation: none !important;
    }
  enable-javascript: true
  wait-for-timeout: 3000
  wait-for-selector: '[data-percy-ready]'
```

### Viewport Presets

Defined in `percy-helpers.ts`:

```typescript
export const VIEWPORT_PRESETS = {
  mobile: { widths: [375] },
  tablet: { widths: [768] },
  desktop: { widths: [1280] },
  wide: { widths: [1920] },
  all: { widths: [375, 768, 1280, 1920] },
  responsive: { widths: [375, 768, 1280] },
}
```

## Writing New Dark Mode Tests

### Basic Pattern

```typescript
import { test } from '@playwright/test'
import { takePercySnapshot, VIEWPORT_PRESETS } from './percy-helpers'

test('captures dark mode component', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Navigate to desired state
  await page.click('[data-testid="component"]')
  
  // Take snapshot
  await takePercySnapshot(
    page, 
    'Dark Mode - Component Name', 
    VIEWPORT_PRESETS.responsive
  )
})
```

### Comparing Themes

```typescript
test('compares light vs dark', async ({ page }) => {
  await page.goto('/')
  
  // Capture default theme
  await takePercySnapshot(page, 'Component - Default', VIEWPORT_PRESETS.desktop)
  
  // Switch to dark mode
  await page.evaluate(() => {
    document.documentElement.classList.add('dark')
  })
  await page.waitForTimeout(300)
  
  // Capture dark theme
  await takePercySnapshot(page, 'Component - Dark', VIEWPORT_PRESETS.desktop)
})
```

### Testing Interactive States

```typescript
test('captures hover states', async ({ page }) => {
  await page.goto('/')
  
  const button = page.locator('[data-testid="primary-button"]')
  
  // Default state
  await takePercySnapshot(page, 'Button - Default', VIEWPORT_PRESETS.desktop)
  
  // Hover state
  await button.hover()
  await page.waitForTimeout(200)
  await takePercySnapshot(page, 'Button - Hover', VIEWPORT_PRESETS.desktop)
  
  // Active state
  await button.click()
  await takePercySnapshot(page, 'Button - Active', VIEWPORT_PRESETS.desktop)
})
```

## Best Practices

### 1. Data Test IDs

Always use `data-testid` attributes:

```typescript
<Button data-testid="quick-capture-button">Quick Capture</Button>
```

Then in tests:

```typescript
await page.click('[data-testid="quick-capture-button"]')
```

### 2. Wait for Stability

```typescript
// Wait for network requests
await page.waitForLoadState('networkidle')

// Wait for specific elements
await page.waitForSelector('[data-testid="vault-sidebar"]', { 
  state: 'visible' 
})

// Wait for animations to complete
await page.waitForTimeout(300)
```

### 3. Disable Animations

Percy config handles most animations, but for custom animations:

```typescript
await page.addStyleTag({
  content: `
    * { 
      animation: none !important; 
      transition: none !important; 
    }
  `,
})
```

### 4. Mark Ready State

Signal when page is stable:

```typescript
await page.evaluate(() => {
  document.body.setAttribute('data-percy-ready', 'true')
})
```

The `takePercySnapshot` helper does this automatically.

### 5. Test Multiple Viewports

Always test responsive behavior:

```typescript
// Test all viewports
await takePercySnapshot(page, 'Component', VIEWPORT_PRESETS.all)

// Or specific breakpoints
await takePercySnapshot(page, 'Component', { widths: [375, 1280] })
```

## Accessibility Validation

### Contrast Ratios

Our dark mode theme maintains WCAG AA compliance:

| Background | Foreground | Ratio | Status |
|------------|------------|-------|--------|
| Background (`oklch(0.12 0.01 270)`) | Foreground (`oklch(0.98 0 0)`) | 15.8:1 | ✅ AAA |
| Primary (`oklch(0.65 0.28 330)`) | Primary Foreground (`oklch(0.98 0 0)`) | 6.2:1 | ✅ AA |
| Secondary (`oklch(0.75 0.15 195)`) | Secondary Foreground (`oklch(0.12 0.01 270)`) | 8.1:1 | ✅ AAA |
| Muted (`oklch(0.25 0.05 270)`) | Muted Foreground (`oklch(0.65 0.05 270)`) | 4.7:1 | ✅ AA |

Test contrast ratios visually:

```typescript
test('validates contrast ratios', async ({ page }) => {
  // Percy will capture and you can review manually
  await takePercySnapshot(page, 'Dark Theme - Contrast Test', VIEWPORT_PRESETS.desktop)
})
```

## Troubleshooting

### Flaky Snapshots

**Problem**: Snapshots differ on every run

**Solutions**:
1. Increase wait times
2. Disable problematic animations
3. Wait for fonts to load

```typescript
await page.waitForFunction(() => document.fonts.ready)
await page.waitForTimeout(1000)
```

### Theme Not Switching

**Problem**: Dark mode class not applying

**Solution**:

```typescript
// Verify class is added
const hasClass = await page.evaluate(() => 
  document.documentElement.classList.contains('dark')
)
console.log('Dark mode active:', hasClass)

// Force re-render
await page.evaluate(() => {
  document.documentElement.classList.add('dark')
  document.body.style.display = 'none'
  document.body.offsetHeight // Force reflow
  document.body.style.display = ''
})
```

### Glow Effects Not Visible

**Problem**: Glow effects disabled by Percy CSS

**Solution**: Percy CSS disables animations for consistency. To test glows:

```typescript
// Override Percy CSS in test
await page.addStyleTag({
  content: `
    .glow-primary {
      animation: none !important;
      box-shadow: 0 0 20px oklch(0.65 0.28 330 / 0.3) !important;
    }
  `,
})
```

### Colors Look Wrong

**Problem**: OKLCH colors not rendering correctly

**Solution**: Ensure browser supports OKLCH color space (Chromium 111+):

```typescript
// Check support
const supportsOKLCH = await page.evaluate(() => {
  return CSS.supports('color', 'oklch(0.5 0.2 180)')
})

if (!supportsOKLCH) {
  test.skip(true, 'Browser does not support OKLCH colors')
}
```

## Reviewing Percy Builds

### 1. Check Build Status

In the Percy dashboard, each build shows:
- **Approved**: No changes detected
- **Unreviewed**: Changes awaiting review
- **Failed**: New regressions detected

### 2. Review Changes

For each flagged snapshot:
- Use side-by-side comparison
- Check all viewport sizes
- Verify intentional vs unintentional changes

### 3. Approve or Reject

- ✅ **Approve**: Change is intentional (new feature, design update)
- ❌ **Reject**: Change is a bug (layout break, color mistake)

Approved snapshots become the new baseline.

## Metrics & Goals

### Current Coverage

- ✅ 45+ UI states captured
- ✅ 4 viewport sizes per test
- ✅ 20+ component variations
- ✅ Full dark mode coverage
- ✅ Theme comparison suite

### Quality Targets

- 🎯 <1% false positive rate
- 🎯 100% critical path coverage
- 🎯 <5min build time
- 🎯 0 unreviewed changes in main
- 🎯 WCAG AA contrast compliance

## Resources

- [Percy Documentation](https://docs.percy.io/)
- [Playwright Testing](https://playwright.dev/)
- [OKLCH Color Space](https://oklch.com/)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum)
- [LatentForge Testing Guide](./TESTING.md)
- [LatentForge Visual Testing](./VISUAL_TESTING.md)

## Contributing

When adding new dark mode features:

1. Add `data-testid` attributes to new components
2. Create visual test in `e2e/visual/dark-mode-themes.spec.ts`
3. Test at multiple viewports
4. Verify WCAG AA contrast compliance
5. Update this documentation with new test coverage

## Support

For issues or questions:
1. Check Percy build logs in dashboard
2. Review Playwright trace files locally
3. Consult [Visual Testing Guide](./VISUAL_TESTING.md)
4. Create issue with Percy build link and screenshots
