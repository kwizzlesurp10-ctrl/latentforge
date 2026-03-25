# Percy CI/CD Quick Reference

Quick command reference for Percy visual regression testing with CI/CD integration.

## 🚀 Setup Commands

```bash
# Validate Percy configuration
npm run percy:validate

# Interactive Percy setup
npm run percy:setup

# Install Percy dependencies
npm install --save-dev @percy/cli @percy/playwright

# Set Percy token
export PERCY_TOKEN=your_percy_token_here
```

## 🧪 Test Commands

```bash
# Run all visual tests
npm run test:visual

# Run dark mode visual tests only
npm run test:visual:dark

# Run theme comparison tests
npm run test:visual:themes

# Run visual tests locally (no Percy)
npm run test:visual:local

# Update visual snapshots
npm run test:visual:update
```

## 📊 Reporting Commands

```bash
# Generate Percy report from logs
npm run percy:report ./percy-output.log

# Generate JSON report
npm run percy:report ./percy-output.log json

# View latest Percy build
open https://percy.io/your-org/latentforge
```

## 🔧 CI/CD Commands

```bash
# Manually trigger visual regression workflow
gh workflow run visual-regression.yml

# View workflow runs
gh run list --workflow=visual-regression.yml

# View specific run details
gh run view <run-id>

# Download artifacts from run
gh run download <run-id>

# Check CI status
gh run list --workflow=ci.yml
```

## 🔑 GitHub Secrets

```bash
# List secrets
gh secret list

# Set Percy token secret
gh secret set PERCY_TOKEN --body "your_token_here"

# Remove secret
gh secret remove PERCY_TOKEN
```

## 📝 Git Workflow

```bash
# Create feature branch
git checkout -b feature/my-feature

# Commit changes
git add .
git commit -m "feat: add new feature"

# Push and create PR
git push -u origin feature/my-feature
gh pr create

# Skip Percy on specific commit
git commit -m "docs: update readme [percy skip]"
```

## 🎨 Percy CLI Commands

```bash
# Run Percy exec manually
npx percy exec -- playwright test e2e/visual

# Percy version
npx percy --version

# Percy help
npx percy --help

# Finalize Percy build manually
npx percy finalize --all

# Percy build info
npx percy build:info
```

## 🔍 Debugging

```bash
# Enable Percy debug logging
export PERCY_DEBUG=1
npm run test:visual

# Enable Playwright debug
npx playwright test e2e/visual --debug

# Run single visual test
npx percy exec -- playwright test e2e/visual/visual-regression.spec.ts

# Run with headed browser
npm run test:visual:local --headed

# Generate Playwright trace
npx playwright test e2e/visual --trace on
```

## 📊 Percy Dashboard URLs

```bash
# View all builds
https://percy.io/your-org/latentforge

# View specific build
https://percy.io/your-org/latentforge/builds/<build-id>

# Project settings
https://percy.io/your-org/latentforge/settings
```

## 🎯 Workflow Triggers

### Visual Regression Workflow

```yaml
# Trigger on PR
on:
  pull_request:
    branches: [main, develop]

# Trigger manually
gh workflow run visual-regression.yml
```

### Percy Status Workflow

```yaml
# Automatically triggered after visual regression completes
on:
  workflow_run:
    workflows: ["Visual Regression Testing"]
    types: [completed]
```

## 📋 Common Patterns

### Run Visual Tests for Specific Component

```bash
# Create focused test
npx percy exec -- playwright test e2e/visual -g "Dashboard"

# Run only changed tests
npx percy exec -- playwright test e2e/visual --only-changed
```

### Percy with Different Browsers

```bash
# Chromium only (default)
npm run test:visual

# Firefox
npx percy exec -- playwright test e2e/visual --project="firefox"

# Mobile Chrome
npx percy exec -- playwright test e2e/visual --project="Mobile Chrome"
```

### Parallel Percy Execution

```bash
# Set parallel shards
export PERCY_PARALLEL_TOTAL=4
export PERCY_PARALLEL_NONCE=$RANDOM

# Run shard
npx percy exec -- playwright test e2e/visual --shard=1/4
```

## 🚨 Emergency Commands

### Cancel Running Workflow

```bash
# List running workflows
gh run list --workflow=visual-regression.yml --status in_progress

# Cancel specific run
gh run cancel <run-id>

# Cancel all running workflows
gh run list --status in_progress --json databaseId --jq '.[].databaseId' | xargs -n1 gh run cancel
```

### Reset Percy Baseline

```bash
# Delete all snapshots for branch
# (Go to Percy dashboard → Build → Actions → Delete)

# Or approve new baseline
gh pr comment <pr-number> --body "Approve Percy baseline"
```

### Fix Failed CI

```bash
# Re-run failed jobs only
gh run rerun <run-id> --failed

# Re-run entire workflow
gh run rerun <run-id>
```

## 📈 Monitoring

### Check Workflow Status

```bash
# Watch workflow in real-time
gh run watch

# List recent runs with status
gh run list --limit 10

# View logs for specific job
gh run view <run-id> --log
```

### Percy Build Status

```bash
# Check via API (requires token)
curl -H "Authorization: Token $PERCY_TOKEN" \
  https://percy.io/api/v1/builds/<build-id>
```

## 🎓 Pro Tips

```bash
# Run Percy locally before pushing
export PERCY_TOKEN=your_token
npm run test:visual

# Validate before committing
npm run percy:validate && git commit

# Create PR with visual tests
gh pr create --fill && gh run watch

# Auto-approve Percy builds with no changes
# (Configure in Percy dashboard settings)

# Skip Percy for documentation changes
git commit -m "docs: update [percy skip]"

# Use Percy in CI only
# Set PERCY_TOKEN in GitHub secrets only
# Don't export in local environment
```

## 📱 Quick Access Links

| Resource | URL |
|----------|-----|
| Percy Dashboard | https://percy.io/your-org/latentforge |
| GitHub Actions | https://github.com/your-org/latentforge/actions |
| Workflow Files | `.github/workflows/` |
| Percy Config | `.percyrc.yml` |
| Visual Tests | `e2e/visual/` |
| Documentation | `PERCY_CI_CD.md` |

## 🆘 Help

```bash
# Percy help
npx percy --help

# Playwright help
npx playwright test --help

# GitHub CLI help
gh help

# Validation help
npm run percy:validate

# Setup help
npm run percy:setup
```

---

**Quick Start**: `npm run percy:setup` → Add `PERCY_TOKEN` to GitHub secrets → Create PR → Review Percy comment

**Documentation**: [PERCY_CI_CD.md](./PERCY_CI_CD.md) | [VISUAL_TESTING.md](./VISUAL_TESTING.md) | [CI_CD_STATUS.md](./CI_CD_STATUS.md)
