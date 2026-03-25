# Percy CI/CD Integration Guide

Complete guide for Percy visual regression testing with automatic PR comments in LatentForge.

## 🚀 Quick Start

### 1. Percy Setup (5 minutes)

1. **Create Percy Account**
   - Go to [percy.io](https://percy.io)
   - Sign up with GitHub
   - Create a new project: `LatentForge`

2. **Get Your Percy Token**
   ```bash
   # From Percy dashboard -> Project Settings -> Tokens
   PERCY_TOKEN=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
   ```

3. **Add Token to GitHub**
   - Go to your repo: Settings → Secrets → Actions
   - Click "New repository secret"
   - Name: `PERCY_TOKEN`
   - Value: Your Percy token from step 2
   - Click "Add secret"

### 2. Local Testing

```bash
# Set token in your environment
export PERCY_TOKEN=your_token_here

# Run visual tests locally
npm run test:visual

# Run with dark mode tests
npm run test:visual:dark

# Run theme comparison tests
npm run test:visual:themes
```

### 3. CI/CD Integration

Percy automatically runs on:
- ✅ Every pull request (PR)
- ✅ Push to main/develop branches
- ✅ Manual workflow dispatch

## 📊 CI/CD Workflows

### Visual Regression Testing Workflow

**File:** `.github/workflows/visual-regression.yml`

**Triggers:**
- Pull requests to `main` or `develop`
- Push to `main`
- Manual dispatch

**What it does:**
1. Builds the application
2. Runs Playwright visual tests
3. Captures snapshots at 4 viewport sizes (375px, 768px, 1280px, 1920px)
4. Uploads snapshots to Percy
5. Posts detailed PR comment with results
6. Updates comment when Percy finishes processing

**Example PR Comment:**

```markdown
## ✅ Percy Visual Regression Tests

**Status:** Completed
**Snapshots captured:** 28
**Build URL:** https://percy.io/org/latentforge/builds/123

### 🎨 Visual Testing Summary

Percy has captured 28 visual snapshots across multiple viewports:
- 📱 Mobile (375px)
- 📱 Tablet (768px)  
- 💻 Desktop (1280px)
- 🖥️ Large Desktop (1920px)

### 📊 What's being tested

- Main dashboard layout
- Forge Canvas interactions
- Shadow Vault sidebar
- AI Preview panel
- Quick Capture modal
- Command Palette
- Dark mode theme variations
- Responsive breakpoints

[👉 Review visual changes on Percy →]
```

### Percy Status Checker Workflow

**File:** `.github/workflows/percy-status.yml`

**Triggers:**
- When Visual Regression workflow completes

**What it does:**
1. Downloads Percy logs from artifacts
2. Parses results (snapshots, changes detected)
3. Updates PR with final status
4. Shows visual change count

### Full CI/CD Pipeline

**File:** `.github/workflows/ci.yml`

Runs in parallel with Percy:
- Lint & Type Check
- Unit Tests (Vitest)
- E2E Tests (Playwright)
- Build Check

All results are aggregated in a single PR comment.

## 🎨 What Percy Tests

### Core Views
- ✅ Main dashboard with Forge Canvas
- ✅ Shadow Vault sidebar (open/closed states)
- ✅ AI Preview panel
- ✅ Quick Capture modal
- ✅ Command Palette overlay
- ✅ Empty states

### Theme Variations
- ✅ Default dark theme (cyberpunk neon-panda)
- ✅ Light mode (if enabled)
- ✅ High contrast mode
- ✅ Color scheme variations

### Responsive Breakpoints
- ✅ Mobile: 375px (iPhone SE)
- ✅ Tablet: 768px (iPad)
- ✅ Desktop: 1280px (laptop)
- ✅ Large: 1920px (desktop)

### Component States
- ✅ Default/rest state
- ✅ Hover state (buttons, links)
- ✅ Focus state (inputs, buttons)
- ✅ Active/pressed state
- ✅ Disabled state
- ✅ Loading states

### Accessibility
- ✅ Color contrast ratios
- ✅ Focus indicators
- ✅ ARIA attributes visibility

## 📝 Writing Percy Tests

### Basic Test Structure

```typescript
import { test, expect } from '@playwright/test';
import percySnapshot from '@percy/playwright';

test.describe('Visual Regression', () => {
  test('captures dashboard', async ({ page }) => {
    await page.goto('/');
    
    // Wait for app to be ready
    await page.waitForSelector('[data-percy-ready]');
    
    // Take Percy snapshot
    await percySnapshot(page, 'Dashboard - Default State', {
      widths: [375, 768, 1280, 1920]
    });
  });
});
```

### Dark Mode Testing

```typescript
test('captures dark mode', async ({ page }) => {
  await page.goto('/');
  
  // App is already in dark mode by default
  await page.waitForSelector('[data-percy-ready]');
  
  await percySnapshot(page, 'Dashboard - Dark Mode', {
    widths: [375, 768, 1280, 1920]
  });
});
```

### Component State Testing

```typescript
test('captures button states', async ({ page }) => {
  await page.goto('/');
  
  // Hover state
  await page.hover('button[aria-label="Quick Capture"]');
  await percySnapshot(page, 'Button - Hover State');
  
  // Focus state
  await page.focus('button[aria-label="Quick Capture"]');
  await percySnapshot(page, 'Button - Focus State');
});
```

### Modal/Dialog Testing

```typescript
test('captures quick capture modal', async ({ page }) => {
  await page.goto('/');
  
  // Open modal
  await page.click('button:has-text("Quick Capture")');
  await page.waitForSelector('[data-testid="quick-capture-modal"]');
  
  await percySnapshot(page, 'Quick Capture Modal');
});
```

## 🔧 Percy Configuration

### `.percyrc.yml`

```yaml
version: 2
snapshot:
  widths:
    - 375    # Mobile
    - 768    # Tablet
    - 1280   # Desktop
    - 1920   # Large desktop
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

### Key Configuration Options

- **widths**: Viewport widths to test
- **min-height**: Minimum snapshot height
- **percy-css**: CSS to inject (disable animations)
- **enable-javascript**: Run JS before capturing
- **wait-for-selector**: Wait for element before snapshot

## 🎯 Best Practices

### 1. Mark Components as Ready

Add `data-percy-ready` when your app is fully loaded:

```typescript
useEffect(() => {
  // After data loads, animations settle, etc.
  document.body.setAttribute('data-percy-ready', 'true');
}, []);
```

### 2. Disable Animations for Percy

```tsx
// Disable animations that cause flakiness
<motion.div 
  animate={...}
  data-disable-percy
/>
```

Or in CSS:
```css
[data-disable-percy] {
  animation: none !important;
  transition: none !important;
}
```

### 3. Name Snapshots Consistently

Use descriptive, hierarchical names:

```typescript
await percySnapshot(page, 'Dashboard - Sidebar Open');
await percySnapshot(page, 'Dashboard - Sidebar Closed');
await percySnapshot(page, 'Canvas - Node Selected');
```

### 4. Test Important User Flows

Focus on:
- Critical user journeys
- Complex UI states
- Responsive breakpoints
- Theme variations

### 5. Approve Baselines Quickly

After creating new tests:
1. Run tests to create snapshots
2. Review on Percy dashboard
3. Approve as baseline
4. Future runs will compare against this

## 🚨 Troubleshooting

### Percy Token Issues

```bash
# Check if token is set
echo $PERCY_TOKEN

# Re-export token
export PERCY_TOKEN=your_token_here

# Verify token works
npx percy --version
```

### Snapshots Not Captured

1. Check if `data-percy-ready` attribute is set
2. Verify wait-for-selector in `.percyrc.yml`
3. Increase `wait-for-timeout` if content loads slowly
4. Check Playwright test passes without Percy

### Flaky Snapshots

Common causes:
- Animations not disabled
- Async content still loading
- Dynamic timestamps/dates
- Random data

Solutions:
```typescript
// Mock dates
await page.addInitScript(() => {
  Date.now = () => 1609459200000; // Fixed timestamp
});

// Disable animations
await page.addStyleTag({
  content: '*, *::before, *::after { animation: none !important; }'
});
```

### Too Many Changes Detected

Percy is very sensitive. To reduce false positives:
- Disable animations in percy-css
- Use fixed data/timestamps
- Wait for loading states to complete
- Freeze random elements (avatars, IDs)

## 📈 Percy Dashboard

### Reviewing Changes

1. Click Percy build URL from PR comment
2. View side-by-side comparison
3. Check diff overlay (red = removed, green = added)
4. Review at different widths
5. Approve or Reject

### Auto-Approval

Percy can auto-approve builds with:
- Zero visual changes
- Changes within threshold
- Approved by rules

Configure in Percy project settings.

### Build Status

- ✅ **Approved**: All good, changes accepted
- ⏳ **Pending**: Waiting for review
- ❌ **Rejected**: Changes not accepted
- 🔄 **Processing**: Percy is analyzing

## 🔗 Integration with GitHub

### PR Check Status

Percy appears as a GitHub check:
- ✅ Green check: No changes or approved
- ⏳ Yellow dot: Awaiting review
- ❌ Red X: Changes rejected or test failed

### Required Checks

To require Percy approval before merging:
1. Go to repo Settings → Branches
2. Edit branch protection for `main`
3. Enable "Require status checks"
4. Select "percy/visual-tests"

### Skip Percy on Certain PRs

Add `[percy skip]` to commit message:
```bash
git commit -m "docs: update readme [percy skip]"
```

## 📊 Metrics & Reporting

### Weekly Report

Percy sends weekly email with:
- Total builds run
- Changes detected
- Time saved vs manual testing
- Coverage metrics

### Build History

View in Percy dashboard:
- Build trends over time
- Most changed components
- Review time metrics
- Approval/rejection rates

## 🎓 Advanced Usage

### Parallel Testing

```yaml
env:
  PERCY_PARALLEL_TOTAL: 4
  PERCY_PARALLEL_NONCE: ${{ github.run_id }}
```

### Custom Scope

```typescript
await percySnapshot(page, 'Component', {
  scope: '#specific-component',
  widths: [1280]
});
```

### Ignore Regions

```typescript
await percySnapshot(page, 'Dashboard', {
  ignore: '.timestamp, .random-avatar'
});
```

## 📚 Resources

- [Percy Documentation](https://docs.percy.io/)
- [Percy + Playwright Guide](https://docs.percy.io/docs/playwright)
- [Percy Best Practices](https://docs.percy.io/docs/best-practices)
- [Visual Testing Guide](./VISUAL_TESTING.md)
- [Dark Mode Testing](./DARK_MODE_TESTING.md)

## 🆘 Getting Help

- Check [Percy Status Page](https://status.percy.io/)
- Read [Percy Community](https://community.percy.io/)
- Review workflow logs in GitHub Actions
- Check Percy build logs in dashboard

---

**Last Updated:** March 2026  
**Maintained by:** LatentForge Team
