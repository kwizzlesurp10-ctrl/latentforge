# Testing Guide for LatentForge

This document provides comprehensive guidance on testing the LatentForge application. The test suite covers unit tests, integration tests, and end-to-end tests for all core functionality.

## Test Infrastructure

### Technologies Used
- **Vitest**: Fast unit testing framework with React Testing Library integration
- **Playwright**: Cross-browser E2E testing for real user workflows
- **Testing Library**: User-centric testing utilities for React components
- **Happy DOM**: Lightweight DOM implementation for unit tests

## Running Tests

### Unit Tests

Run all unit tests:
```bash
npm test
```

Run tests in watch mode during development:
```bash
npm test -- --watch
```

Run tests with UI:
```bash
npm run test:ui
```

Run tests once with coverage:
```bash
npm run test:coverage
```

### E2E Tests

Run all E2E tests:
```bash
npm run test:e2e
```

Run E2E tests with UI:
```bash
npm run test:e2e:ui
```

Run E2E tests in headed mode (see browser):
```bash
npm run test:e2e:headed
```

Debug E2E tests:
```bash
npm run test:e2e:debug
```

### Visual Regression Tests

Run visual regression tests with Percy:
```bash
npm run test:visual
```

Update visual baselines (use with caution):
```bash
npm run test:visual:update
```

**Note**: Visual tests require a `PERCY_TOKEN` environment variable. See [VISUAL_TESTING.md](./VISUAL_TESTING.md) for setup details.

### Run All Tests

Run both unit and E2E tests:
```bash
npm run test:all
```

## Test Coverage

### Unit Tests Coverage

The unit test suite covers:

#### Utility Functions (`src/lib/utils.test.ts`)
- Class name merging with `cn` utility
- Tailwind class deduplication
- Conditional class handling

#### Canvas Components
- **ForgeCanvas** (`src/components/canvas/ForgeCanvas.test.tsx`)
  - Rendering toolbar and controls
  - Adding text, code, and image nodes
  - Node selection and deletion
  - Zoom controls
  - Connection rendering
  - Empty states
  
- **CanvasNode** (`src/components/canvas/CanvasNode.test.tsx`)
  - Node content rendering
  - Type-specific styling (code vs text)
  - Content editing
  - Delete functionality
  - Selection states
  - Drag interactions

#### Vault Components (`src/components/vault/VaultSidebar.test.tsx`)
- Sidebar toggling
- Item rendering and display
- Tag filtering and display
- Item selection
- Item deletion
- Empty states
- Tab navigation

#### AI Workflows (`src/components/AIPreviewPanel.test.tsx`)
- Preview panel rendering
- Mode switching (Refine, Expand, Extract, Transform)
- AI generation states
- Copy functionality
- Regenerate functionality
- Content display
- Close interactions

### E2E Test Coverage

The E2E test suite covers complete user workflows:

#### Canvas Interactions (`e2e/canvas.spec.ts`)
- ✅ Canvas rendering with toolbar
- ✅ Adding text nodes
- ✅ Adding code nodes  
- ✅ Adding multiple nodes
- ✅ Node selection
- ✅ Node deletion
- ✅ Zoom controls (in/out)
- ✅ Node dragging and repositioning
- ✅ Data persistence across page reloads
- ✅ Empty state display

#### Vault Operations (`e2e/vault.spec.ts`)
- ✅ Sidebar toggle
- ✅ Quick capture dialog
- ✅ Creating vault items
- ✅ Tab switching (All/Tags)
- ✅ Item selection
- ✅ Item deletion
- ✅ Empty state display

#### AI Workflows (`e2e/ai-workflows.spec.ts`)
- ✅ AI preview on vault item selection
- ✅ AI preview on canvas node selection
- ✅ Mode switching (Refine/Expand/Extract/Transform)
- ✅ Generating state display
- ✅ AI content rendering
- ✅ Copy to clipboard
- ✅ Regenerate content
- ✅ Close preview panel
- ✅ Content type handling

## Writing New Tests

### Unit Test Pattern

```typescript
import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { YourComponent } from './YourComponent'

describe('YourComponent', () => {
  it('should render correctly', () => {
    render(<YourComponent />)
    expect(screen.getByText('Expected Text')).toBeInTheDocument()
  })

  it('should handle user interactions', () => {
    const mockHandler = vi.fn()
    render(<YourComponent onAction={mockHandler} />)
    
    fireEvent.click(screen.getByRole('button'))
    expect(mockHandler).toHaveBeenCalled()
  })
})
```

### E2E Test Pattern

```typescript
import { test, expect } from '@playwright/test'

test.describe('Feature Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should perform user action', async ({ page }) => {
    await page.getByRole('button', { name: /Action/i }).click()
    await expect(page.getByText('Expected Result')).toBeVisible()
  })
})
```

## Test Organization

```
/workspaces/spark-template/
├── src/
│   ├── lib/
│   │   └── utils.test.ts           # Utility function tests
│   ├── components/
│   │   ├── canvas/
│   │   │   ├── ForgeCanvas.test.tsx    # Canvas integration tests
│   │   │   └── CanvasNode.test.tsx     # Node component tests
│   │   ├── vault/
│   │   │   └── VaultSidebar.test.tsx   # Sidebar tests
│   │   └── AIPreviewPanel.test.tsx     # AI preview tests
│   └── test/
│       ├── setup.ts                 # Test environment setup
│       └── mockData.ts             # Mock data generators
├── e2e/
│   ├── canvas.spec.ts              # Canvas E2E tests
│   ├── vault.spec.ts               # Vault E2E tests
│   ├── ai-workflows.spec.ts        # AI workflow E2E tests
│   └── visual/
│       ├── visual-regression.spec.ts  # Visual regression tests
│       └── percy-helpers.ts           # Percy utility functions
├── vitest.config.ts                # Vitest configuration
├── playwright.config.ts            # Playwright configuration
└── .percyrc.yml                    # Percy configuration
```

## Mock Data

Test utilities and mock data are available in `src/test/mockData.ts`:

```typescript
import { mockVaultItems, mockCanvasNodes, createMockVaultItem } from '@/test/mockData'

// Use in tests
const item = createMockVaultItem({ content: 'Custom content', type: 'code' })
```

## CI/CD Integration

Tests are configured to run in CI environments:

- **Unit tests**: Run on every commit
- **E2E tests**: Run with retries in CI
- **Visual regression tests**: Run with Percy on PRs and main branch pushes
- **Coverage reports**: Generated for unit tests
- **Cross-browser testing**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

### GitHub Actions Workflows

- `.github/workflows/ci.yml` - Unit and E2E tests
- `.github/workflows/visual-regression.yml` - Percy visual tests

See [VISUAL_TESTING.md](./VISUAL_TESTING.md) for detailed visual regression testing documentation.

## Debugging Tests

### Unit Tests
- Use `test.only()` to run a single test
- Use `console.log()` or `screen.debug()` to inspect component state
- Check test output for detailed error messages

### E2E Tests
- Use `--debug` flag to step through tests
- Use `--headed` flag to see browser actions
- Check screenshots on failure (saved to `test-results/`)
- Use `page.pause()` to manually inspect during test

## Best Practices

1. **Test user behavior, not implementation details**
   - Use accessible selectors (roles, labels)
   - Test what users see and do
   - Avoid testing internal state directly

2. **Keep tests isolated and independent**
   - Each test should set up its own data
   - Don't rely on test execution order
   - Clean up after tests

3. **Use meaningful test descriptions**
   - Describe what the test verifies
   - Use "should" statements
   - Be specific about expected behavior

4. **Mock external dependencies**
   - Mock Spark APIs in unit tests
   - Use test setup file for global mocks
   - Keep mocks simple and focused

5. **Test edge cases and error states**
   - Empty states
   - Loading states
   - Error conditions
   - Boundary values

## Performance Considerations

- Unit tests run in parallel by default
- E2E tests run sequentially in CI for stability
- Use `.skip` or `.todo` for tests under development
- Keep test suites fast by minimizing unnecessary waits

## Troubleshooting

### Common Issues

**Tests timing out**:
- Increase timeout in test configuration
- Check for missing `await` keywords
- Verify network requests complete

**Flaky E2E tests**:
- Add explicit waits for dynamic content
- Use `waitForLoadState('networkidle')`
- Increase retry count in CI

**Mock data not working**:
- Verify mock setup in `test/setup.ts`
- Check import paths are correct
- Ensure mocks are cleared between tests

## Test Metrics

Target metrics for test suite health:
- **Unit test coverage**: > 80%
- **E2E test pass rate**: > 95%
- **Test execution time**: < 2 minutes total
- **Flakiness**: < 1%

## Contributing

When adding new features:
1. Write unit tests for new components
2. Add E2E tests for new user workflows
3. Update this documentation
4. Ensure all tests pass before submitting PR
5. Aim for high test coverage on critical paths
