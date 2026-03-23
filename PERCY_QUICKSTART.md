# Percy Quick Start Guide

Get visual regression testing running in under 5 minutes.

## 1. Percy Account Setup (2 minutes)

1. Go to [percy.io](https://percy.io)
2. Sign up with your GitHub account
3. Create a new project:
   - Name: `LatentForge`
   - Repository: Link your GitHub repo (optional)
4. Copy your `PERCY_TOKEN` from project settings

## 2. Local Setup (1 minute)

```bash
# Add Percy token to your environment
echo "PERCY_TOKEN=your_percy_token_here" >> .env

# Or export for current session
export PERCY_TOKEN=your_percy_token_here
```

## 3. Run Your First Visual Test (2 minutes)

```bash
# Install dependencies (if not already done)
npm install

# Run visual tests
npm run test:visual
```

You'll see output like:
```
[percy] Percy has started!
[percy] Created build #1: https://percy.io/your-org/LatentForge/builds/1
[percy] Running "playwright test e2e/visual"
...
[percy] Finalized build #1: https://percy.io/your-org/LatentForge/builds/1
[percy] Done!
```

## 4. Review Snapshots

1. Click the Percy build link from the console output
2. View all captured snapshots
3. Approve the initial baseline snapshots

## 5. Make a Visual Change

```bash
# Edit a component (e.g., change a color in index.css)
vim src/index.css

# Run visual tests again
npm run test:visual
```

Percy will:
- Detect the visual difference
- Show you a side-by-side comparison
- Highlight the changed pixels
- Wait for your approval or rejection

## Done! 🎉

You now have visual regression testing protecting your UI from unintended changes.

## Next Steps

- Read [VISUAL_TESTING.md](./VISUAL_TESTING.md) for comprehensive documentation
- Add visual tests for your new features
- Set up CI/CD with Percy (see workflow in `.github/workflows/visual-regression.yml`)
- Configure Percy project settings for your team

## Troubleshooting

### "Missing Percy token"
Export the token in your shell:
```bash
export PERCY_TOKEN=your_token_here
```

### "Percy finalized build with 0 snapshots"
Make sure Playwright is capturing properly:
```bash
# Test without Percy first
npx playwright test e2e/visual --headed
```

### Need Help?
- [Percy Docs](https://docs.percy.io/)
- [Percy Playwright Integration](https://docs.percy.io/docs/playwright)
- Check our [VISUAL_TESTING.md](./VISUAL_TESTING.md)
