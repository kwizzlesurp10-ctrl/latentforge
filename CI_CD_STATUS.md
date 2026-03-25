# CI/CD Status Dashboard

Complete overview of LatentForge's automated testing and deployment pipeline.

## 🎯 Workflow Overview

LatentForge uses GitHub Actions for continuous integration and deployment with comprehensive automated testing, including visual regression testing with Percy.

### Active Workflows

| Workflow | Trigger | Purpose | Status Badge |
|----------|---------|---------|--------------|
| **CI Pipeline** | Push, PR | Lint, typecheck, unit tests, E2E | ![CI](https://github.com/YOUR_ORG/latentforge/workflows/CI/badge.svg) |
| **Visual Regression** | PR | Percy visual snapshots | ![Visual Tests](https://github.com/YOUR_ORG/latentforge/workflows/Visual%20Regression%20Testing/badge.svg) |
| **Percy Status** | Workflow completion | PR comment updates | Automatic |
| **Percy PR Comment** | Workflow completion | Enhanced PR reporting | Automatic |

## 📊 CI Pipeline (`.github/workflows/ci.yml`)

### Jobs

1. **Lint & Type Check** (10 min)
   - ESLint validation
   - TypeScript compilation check
   - Zero tolerance for type errors

2. **Unit Tests** (10 min)
   - Vitest test runner
   - Component unit tests
   - Utility function tests
   - Hook behavior tests
   - Coverage reports

3. **E2E Tests** (15 min)
   - Playwright browser tests
   - User flow validation
   - Canvas interaction tests
   - AI workflow tests
   - Cross-browser compatibility

4. **Build Check** (10 min)
   - Production build
   - Build size analysis
   - Asset optimization check

5. **Status Check** (Summary)
   - Aggregates all job results
   - Posts summary comment to PR
   - Fails if any job fails

### PR Comment Example

```markdown
## ✅ All checks passed!

| Job | Status |
|-----|--------|
| ✅ Lint & Type Check | success |
| ✅ Unit Tests | success |
| ✅ E2E Tests | success |
| ✅ Build Check | success |

---

Commit: abc1234
Run: #42
```

## 🎨 Visual Regression (`.github/workflows/visual-regression.yml`)

### Jobs

1. **Percy Visual Tests** (20 min)
   - Builds application
   - Runs Playwright visual tests
   - Captures snapshots at 4 viewports
   - Uploads to Percy
   - Posts initial PR comment

2. **Percy Mobile Tests** (15 min)
   - Separate mobile-focused tests
   - Specialized mobile viewport testing
   - Touch interaction validation

3. **Percy Finalize** (After completion)
   - Waits for Percy processing
   - Updates PR with final results
   - Links to Percy dashboard

### Viewport Testing

| Viewport | Width | Device Type |
|----------|-------|-------------|
| Mobile | 375px | iPhone SE |
| Tablet | 768px | iPad |
| Desktop | 1280px | Laptop |
| Large | 1920px | Desktop |

### PR Comment Features

- **Snapshot count** - Total visual captures
- **Change detection** - Number of visual diffs
- **Build URL** - Direct link to Percy dashboard
- **Review guidance** - Step-by-step instructions
- **Troubleshooting** - Common issues and fixes
- **Configuration details** - Percy setup info

### Example PR Comment

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
- Component states (hover, active, disabled)

[👉 Review visual changes on Percy →]
```

## 🔄 Percy Status Checker (`.github/workflows/percy-status.yml`)

### Trigger
- Runs after Visual Regression workflow completes
- Works on both success and failure

### Features
- Downloads Percy logs from artifacts
- Parses snapshot counts and change detection
- Updates PR with finalized status
- Shows visual change summary

### Status Updates

| Status | Indicator | Meaning |
|--------|-----------|---------|
| Success | ✅ | No visual changes or approved |
| Warning | ⚠️ | Changes detected, needs review |
| Failure | ❌ | Tests failed or rejected |

## 💬 Enhanced PR Comments (`.github/workflows/percy-pr-comment.yml`)

### Features

- **Comprehensive reporting** with visual diff details
- **Review guidance** with step-by-step instructions
- **Troubleshooting tips** for common issues
- **Visual diff tables** showing what changed
- **Pro tips** for efficient Percy reviews
- **Auto-update** - Comment updates as tests progress

### Comment Sections

1. **Header** - Status, snapshots, author, branches
2. **Percy Report** - Generated from log parsing
3. **Review Instructions** - How to review changes
4. **Visual Coverage** - What's being tested
5. **Common Issues** - Troubleshooting table
6. **Next Steps** - Action items
7. **Pro Tips** - Advanced usage (collapsible)
8. **Troubleshooting** - Debug commands (collapsible)

## 🔐 Required Secrets

Add these to your repository settings: `Settings → Secrets → Actions`

| Secret | Purpose | Required |
|--------|---------|----------|
| `PERCY_TOKEN` | Percy API authentication | ✅ Yes |

### Getting Your Percy Token

1. Go to [percy.io](https://percy.io)
2. Sign up with GitHub
3. Create project: "LatentForge"
4. Navigate to: Project Settings → Tokens
5. Copy token and add to GitHub secrets

## 📈 Performance Metrics

### Typical Run Times

| Workflow | Average | Max |
|----------|---------|-----|
| CI Pipeline | 8 min | 15 min |
| Visual Regression | 12 min | 20 min |
| Percy Processing | 2 min | 5 min |
| Total PR Validation | ~15 min | ~30 min |

### Resource Usage

- **Concurrent jobs**: Up to 4 (GitHub limits)
- **Artifact storage**: 7 days retention
- **Percy builds**: Unlimited (Percy plan)
- **Lighthouse scores**: Target 95+

## 🎯 Status Checks

### Required Checks (Branch Protection)

Configure in: `Settings → Branches → main → Edit`

Recommended required checks:
- ✅ `CI / Lint & Type Check`
- ✅ `CI / Unit Tests`
- ✅ `CI / E2E Tests`
- ✅ `CI / Build Check`
- ✅ `Percy Visual Tests`

### Optional Checks

- `Percy Mobile Tests` - Additional mobile validation
- `Lighthouse CI` - Performance scoring (if configured)

## 🚀 Deployment

### Automatic Deployment

When PR merges to `main`:
1. All CI checks pass ✅
2. Percy visual tests approved ✅
3. Automatic deploy to production
4. Deployment notifications

### Preview Deployments

On every PR:
- Preview URL generated
- Available in PR comment
- Isolated environment
- Full feature testing

## 🔧 Configuration Files

### Core Config Files

| File | Purpose |
|------|---------|
| `.percyrc.yml` | Percy snapshot configuration |
| `playwright.config.ts` | E2E and visual test config |
| `vitest.config.ts` | Unit test configuration |
| `.github/workflows/*.yml` | CI/CD workflow definitions |

### Percy Configuration

```yaml
# .percyrc.yml
version: 2
snapshot:
  widths: [375, 768, 1280, 1920]
  min-height: 1024
  enable-javascript: true
  wait-for-selector: '[data-percy-ready]'
  percy-css: |
    .pulse-glow, .glow-hover { animation: none !important; }
```

## 📊 Monitoring & Alerts

### GitHub Actions Notifications

Configure in: `Settings → Notifications`
- Email on workflow failure
- Slack integration (optional)
- Discord webhooks (optional)

### Percy Notifications

Configure in Percy dashboard:
- Email on build completion
- Slack notifications
- Build status webhooks

## 🐛 Troubleshooting

### Common Issues

#### Percy Token Not Found

```bash
# Check secret is set
gh secret list | grep PERCY_TOKEN

# Set secret
gh secret set PERCY_TOKEN --body "your_token_here"
```

#### Workflow Not Triggering

1. Check workflow file syntax
2. Verify branch protection settings
3. Ensure `.github/workflows/` is committed
4. Check GitHub Actions enabled in repo settings

#### Visual Tests Failing

1. Review Percy build on dashboard
2. Check for unintended CSS changes
3. Verify animations disabled in percy-css
4. Approve baseline if first run

#### PR Comments Not Posting

1. Check workflow has `pull-requests: write` permission
2. Verify GitHub App has access
3. Check workflow run logs for errors
4. Ensure PR number detection works

### Debug Commands

```bash
# Validate Percy configuration
npm run percy:validate

# Run visual tests locally
export PERCY_TOKEN=your_token
npm run test:visual:local

# Generate Percy report from logs
npm run percy:report ./percy-output.log

# Check GitHub Actions status
gh run list --workflow=ci.yml

# View specific workflow run
gh run view <run-id>
```

## 📚 Additional Resources

- [GitHub Actions Documentation](https://docs.github.com/actions)
- [Percy Documentation](https://docs.percy.io/)
- [Playwright Documentation](https://playwright.dev/)
- [Visual Testing Guide](./VISUAL_TESTING.md)
- [Percy CI/CD Guide](./PERCY_CI_CD.md)
- [Testing Documentation](./TESTING.md)

## 🎓 Best Practices

### For Developers

1. **Run tests locally** before pushing
2. **Review Percy diffs carefully** - Don't auto-approve everything
3. **Keep visual tests focused** - Test user-facing features
4. **Update baselines promptly** - Don't let them get stale
5. **Monitor workflow times** - Optimize slow tests

### For Reviewers

1. **Check CI status first** - Don't review failing PRs
2. **Review Percy diffs** - Visual changes matter
3. **Verify test coverage** - New features need tests
4. **Check build size** - Watch for bloat
5. **Approve Percy builds** - Don't leave them pending

### For Teams

1. **Set up required checks** - Enforce quality gates
2. **Configure branch protection** - Protect main branch
3. **Review Percy weekly** - Approve/reject pending builds
4. **Monitor flaky tests** - Fix or disable them
5. **Update dependencies** - Keep CI tools current

---

**Last Updated:** March 2026  
**Maintained by:** LatentForge Team
