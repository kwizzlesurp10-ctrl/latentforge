# Visual Regression Testing with Percy

## Overview

LatentForge uses Percy for automated visual regression testing to catch unintended UI changes across different viewports and browsers. This ensures the cyberpunk neon-panda aesthetic and premium user experience remain consistent with every code change.

## What is Visual Regression Testing?

Visual regression testing captures screenshots of your application and compares them pixel-by-pixel against baseline images. This catches:
- Layout shifts
- Color/theme changes
- Font rendering issues  
- Animation glitches
- Responsive design breaks
- Component styling regressions

## Setup

### 1. Install Dependencies

Already installed via npm:
```bash
npm install --save-dev @percy/cli @percy/playwright
```

### 2. Percy Account Setup

1. Sign up at [percy.io](https://percy.io)
2. Create a new project for LatentForge
3. Get your `PERCY_TOKEN` from project settings

### 3. Environment Configuration

Add to your `.env` file (never commit this):
```bash
PERCY_TOKEN=your_percy_token_here
```

For CI/CD, add `PERCY_TOKEN` as a secret in your GitHub repository settings.

## Configuration Files

### `.percyrc.yml`

Percy configuration controls snapshot behavior:

```yaml
version: 2
snapshot:
  widths: [375, 768, 1280, 1920]  # Mobile, tablet, desktop, wide
  min-height: 1024
  percy-css: |  # Disable animations for consistent snapshots
    .pulse-glow,
    .glow-hover,
    [data-disable-percy] {
      animation: none !important;
    }
  enable-javascript: true
  wait-for-timeout: 3000
  wait-for-selector: '[data-percy-ready]'  # Wait for this attribute before capturing
```

**Key Settings:**
- `widths`: Test responsive behavior across breakpoints
- `percy-css`: Disable animations that cause snapshot inconsistencies
- `wait-for-selector`: Ensures dynamic content loads before capture
- `enable-javascript`: Required for React apps

## Running Visual Tests

### Local Development

```bash
# Run visual regression tests
npm run test:visual

# Run with Playwright UI (no Percy snapshots)
npx playwright test e2e/visual --ui

# Debug specific test
npx playwright test e2e/visual/visual-regression.spec.ts:10 --debug
```

### CI/CD Pipeline

Visual tests run automatically on:
- Pull requests
- Pushes to `main` branch
- Manual workflow dispatch

Percy compares new snapshots against the approved baseline and flags any differences for review.

## Writing Visual Tests

### Basic Structure

```typescript
import { test } from '@playwright/test'
import percySnapshot from '@percy/playwright'

test('captures component state', async ({ page }) => {
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  
  // Perform actions to reach desired state
  await page.click('[data-testid="quick-capture"]')
  await page.fill('input[name="title"]', 'Test Input')
  
  // Mark as ready for Percy
  await page.evaluate(() => {
    document.body.setAttribute('data-percy-ready', 'true')
  })
  
  // Take snapshot
  await percySnapshot(page, 'Component State Name', {
    widths: [375, 1280],  // Override default widths if needed
  })
})
```

### Best Practices

#### 1. Use Data Test IDs

Components have `data-testid` attributes for reliable selectors:
```typescript
await page.waitForSelector('[data-testid="vault-sidebar"]')
await page.click('[data-testid="vault-item"]')
```

#### 2. Wait for Dynamic Content

```typescript
// Wait for network requests
await page.waitForLoadState('networkidle')

// Wait for specific elements
await page.waitForSelector('[data-testid="ai-preview-panel"]', { 
  state: 'visible' 
})

// Wait for animations to complete
await page.waitForTimeout(500)
```

#### 3. Mark When Ready

Use `data-percy-ready` to signal when the page is stable:
```typescript
await page.evaluate(() => {
  document.body.setAttribute('data-percy-ready', 'true')
})
```

#### 4. Handle Animations

Disable problematic animations in Percy CSS or via test setup:
```typescript
await page.addStyleTag({ 
  content: `.pulse-glow { animation: none !important; }` 
})
```

#### 5. Test Multiple States

Capture different interaction states:
```typescript
// Default state
await percySnapshot(page, 'Button - Default')

// Hover state
await page.hover('[data-testid="primary-button"]')
await page.waitForTimeout(200)
await percySnapshot(page, 'Button - Hover')

// Active state
await page.click('[data-testid="primary-button"]')
await percySnapshot(page, 'Button - Active')
```

## Coverage Areas

### Current Visual Test Coverage

1. **Dashboard Layouts**
   - Vault sidebar open/collapsed
   - Mobile vs desktop views
   - Empty states

2. **Modals & Dialogs**
   - Quick Capture modal
   - Command Palette
   - AI Preview Panel

3. **Interactive Elements**
   - Button hover states
   - Tooltip appearances
   - Form inputs

4. **Canvas Views**
   - Forge canvas with/without nodes
   - Node connections
   - Zoom levels

5. **Vault Components**
   - Item cards (all types)
   - Tag filters
   - Item selection states

6. **Theme Consistency**
   - Color palette application
   - Glow effects
   - Typography hierarchy

### Adding New Tests

When adding new UI features:

1. Add `data-testid` attributes to new components
2. Create visual test in `e2e/visual/`
3. Cover key interaction states
4. Test responsive behavior at multiple widths
5. Verify animations are properly disabled for snapshots

## Reviewing Changes

### Percy Dashboard

When tests run, Percy creates a build with:
- **Approved**: No visual changes detected
- **Unreviewed**: Changes detected, awaiting review
- **Changed**: Previously reviewed changes

### Review Process

1. Check Percy build in PR
2. Review each flagged snapshot
3. Compare old vs new side-by-side
4. Approve intentional changes
5. Reject unintended regressions

### Approving Changes

In Percy dashboard:
- ✅ **Approve**: Change is intentional (button redesign, new feature)
- ❌ **Reject**: Change is a bug (layout break, color mistake)

Approved snapshots become the new baseline.

## Troubleshooting

### Flaky Snapshots

**Problem**: Snapshots differ on every run

**Solutions**:
```typescript
// Increase wait times
await page.waitForTimeout(1000)

// Wait for specific conditions
await page.waitForFunction(() => 
  !document.querySelector('.loading-spinner')
)

// Disable problematic animations
await page.addStyleTag({ 
  content: `* { animation: none !important; transition: none !important; }` 
})
```

### Fonts Not Loading

**Problem**: Text renders differently

**Solution**:
```typescript
// Wait for fonts to load
await page.waitForFunction(() => document.fonts.ready)
await page.evaluate(() => document.body.setAttribute('data-percy-ready', 'true'))
```

### Percy Token Issues

**Error**: `Missing Percy token`

**Solution**:
```bash
# Export token
export PERCY_TOKEN=your_token_here

# Or create .env file
echo "PERCY_TOKEN=your_token_here" > .env
```

### Timeouts

**Error**: `Timeout waiting for selector`

**Solution**:
```typescript
// Increase timeout
await page.waitForSelector('[data-testid="element"]', { 
  timeout: 10000 
})

// Or check if element exists first
const exists = await page.locator('[data-testid="element"]').count() > 0
if (exists) {
  await percySnapshot(page, 'Conditional Snapshot')
}
```

## CI/CD Integration

### GitHub Actions Workflow

```yaml
name: Visual Regression Tests

on:
  pull_request:
  push:
    branches: [main]

jobs:
  percy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Install Playwright browsers
        run: npx playwright install --with-deps chromium
        
      - name: Run visual tests
        env:
          PERCY_TOKEN: ${{ secrets.PERCY_TOKEN }}
        run: npm run test:visual
```

### Required Secrets

Add to GitHub repository settings:
- `PERCY_TOKEN`: Your Percy project token

## Best Practices Summary

✅ **DO:**
- Use `data-testid` for stable selectors
- Wait for `networkidle` before snapshots
- Test multiple viewports (mobile, tablet, desktop)
- Disable animations that cause flakiness
- Review Percy builds before merging PRs
- Approve intentional visual changes promptly

❌ **DON'T:**
- Take snapshots during animations
- Use unstable selectors (nth-child, complex CSS)
- Ignore Percy build failures
- Commit Percy tokens to repository
- Skip responsive testing
- Leave changes unreviewed

## Metrics & Goals

### Current Coverage
- ✅ 15+ UI states covered
- ✅ 4 viewport sizes tested
- ✅ 3+ browsers (Chromium, Firefox, WebKit)
- ✅ Key user flows validated

### Targets
- 🎯 <2% false positive rate
- 🎯 100% critical path coverage
- 🎯 <5min build time
- 🎯 0 unreviewed changes in main branch

## Resources

- [Percy Documentation](https://docs.percy.io/)
- [Playwright Visual Testing](https://playwright.dev/docs/test-snapshots)
- [Percy for Playwright](https://docs.percy.io/docs/playwright)
- [LatentForge Testing Guide](./TESTING.md)

## Support

For issues or questions:
1. Check Percy build logs
2. Review Playwright trace files
3. Consult team in #visual-testing channel
4. Create issue with Percy build link
