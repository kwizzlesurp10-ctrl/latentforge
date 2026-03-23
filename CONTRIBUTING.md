# Contributing to LatentForge

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to LatentForge. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [How Can I Contribute?](#how-can-i-contribute)
  - [Reporting Bugs](#reporting-bugs)
  - [Suggesting Enhancements](#suggesting-enhancements)
  - [Your First Code Contribution](#your-first-code-contribution)
  - [Pull Requests](#pull-requests)
- [Style Guides](#style-guides)
  - [Git Commit Messages](#git-commit-messages)
  - [TypeScript Style Guide](#typescript-style-guide)
  - [React Component Guidelines](#react-component-guidelines)
- [Development Setup](#development-setup)

---

## Code of Conduct

This project and everyone participating in it is governed by respect, creativity, and rebellion against mediocrity. By participating, you are expected to uphold this spirit.

**Be excellent to each other.** 🤘

---

## How Can I Contribute?

### Reporting Bugs

Before creating bug reports, please check existing issues to avoid duplicates.

When creating a bug report, include as many details as possible:

- **Clear title** describing the problem
- **Steps to reproduce** the behavior
- **Expected behavior** vs actual behavior
- **Screenshots** if applicable
- **Environment**: Browser, OS, device type
- **Console errors**: Open DevTools and check for errors

**Template:**

```markdown
**Bug Description**
A clear and concise description of what the bug is.

**To Reproduce**
Steps to reproduce the behavior:
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected Behavior**
A clear and concise description of what you expected to happen.

**Screenshots**
If applicable, add screenshots to help explain your problem.

**Environment:**
- Browser: [e.g. Chrome 120, Safari 17]
- OS: [e.g. macOS 14, Windows 11]
- Device: [e.g. Desktop, iPhone 15]

**Additional Context**
Add any other context about the problem here.
```

### Suggesting Enhancements

Enhancement suggestions are tracked as GitHub issues. When creating an enhancement suggestion:

- **Use a clear title** that describes the enhancement
- **Provide detailed description** of the proposed functionality
- **Explain why this would be useful** to most users
- **Include mockups or examples** if applicable

**Template:**

```markdown
**Feature Description**
A clear and concise description of what you want to happen.

**Use Case**
Explain the problem this feature would solve or the workflow it would improve.

**Proposed Solution**
Describe how you envision this feature working.

**Alternatives Considered**
Describe alternative solutions or features you've considered.

**Additional Context**
Add any other context, screenshots, or examples about the feature request.
```

### Your First Code Contribution

Unsure where to begin? You can start by looking through `good-first-issue` and `help-wanted` labels:

- **Good first issues**: Simple issues that require only a few lines of code
- **Help wanted issues**: More involved issues that need attention

### Pull Requests

1. **Fork the repo** and create your branch from `main`
2. **Make your changes** following the style guides below
3. **Test your changes** thoroughly
4. **Update documentation** if you've changed APIs or added features
5. **Write clear commit messages** (see guidelines below)
6. **Submit the pull request** with a comprehensive description

**PR Template:**

```markdown
## Description
Brief description of what this PR does.

## Type of Change
- [ ] Bug fix (non-breaking change fixing an issue)
- [ ] New feature (non-breaking change adding functionality)
- [ ] Breaking change (fix or feature causing existing functionality to change)
- [ ] Documentation update

## Testing
- [ ] I have tested these changes locally
- [ ] All TypeScript types are correct
- [ ] No console errors or warnings
- [ ] Tested on multiple browsers/devices (if UI changes)

## Screenshots (if applicable)
Add screenshots to demonstrate the changes.

## Checklist
- [ ] My code follows the style guidelines
- [ ] I have commented my code where necessary
- [ ] I have updated the documentation accordingly
- [ ] My changes generate no new warnings
```

---

## Style Guides

### Git Commit Messages

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

**Examples:**

```
feat: add timeline branch visualization
fix: resolve canvas performance with 1000+ nodes
docs: update deployment instructions for Vercel
refactor: extract vault item rendering logic
style: apply consistent spacing in ForgeCanvas
```

**Prefixes:**

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style changes (formatting, no logic change)
- `refactor:` - Code refactoring
- `perf:` - Performance improvements
- `test:` - Adding or updating tests
- `chore:` - Build process or auxiliary tool changes

### TypeScript Style Guide

- **Use TypeScript strict mode**
- **Define interfaces** for all component props
- **Avoid `any` type** - use `unknown` if type is truly unknown
- **Use functional components** with hooks (no class components)
- **Prefer const assertions** for literal types

**Good:**

```typescript
interface VaultItemProps {
  item: VaultItem
  onSelect: (id: string) => void
  isSelected: boolean
}

export function VaultItemCard({ item, onSelect, isSelected }: VaultItemProps) {
  // Implementation
}
```

**Bad:**

```typescript
export function VaultItemCard(props: any) {
  // Implementation
}
```

### React Component Guidelines

- **One component per file** (except for small, tightly-coupled subcomponents)
- **Use functional components** with hooks
- **Prefer composition** over inheritance
- **Keep components small** and focused on a single responsibility
- **Extract complex logic** into custom hooks

**Component Structure:**

```typescript
// 1. Imports
import { useState } from 'react'
import { Button } from '@/components/ui/button'

// 2. Types/Interfaces
interface MyComponentProps {
  title: string
  onAction: () => void
}

// 3. Component
export function MyComponent({ title, onAction }: MyComponentProps) {
  // 3a. Hooks
  const [state, setState] = useState(false)
  
  // 3b. Event handlers
  const handleClick = () => {
    setState(true)
    onAction()
  }
  
  // 3c. Render
  return (
    <div>
      <h2>{title}</h2>
      <Button onClick={handleClick}>Action</Button>
    </div>
  )
}
```

### CSS & Styling Guidelines

- **Use Tailwind utilities** first
- **Custom CSS only when necessary** (add to index.css)
- **Follow existing theme variables** for colors
- **Use semantic color names** from theme (--primary, --secondary)
- **Mobile-first responsive design**

**Good:**

```tsx
<div className="flex items-center gap-3 p-4 rounded-lg bg-card hover:bg-card/80 transition-colors">
  <Icon className="text-primary" />
  <span className="text-sm font-medium">Label</span>
</div>
```

**Bad:**

```tsx
<div style={{ 
  display: 'flex', 
  padding: '16px', 
  backgroundColor: '#1a1a2e' 
}}>
  <Icon style={{ color: '#c846d4' }} />
  <span style={{ fontSize: '14px' }}>Label</span>
</div>
```

---

## Development Setup

### Prerequisites

- Node.js 18+ and npm 9+
- Git
- Modern browser (Chrome, Firefox, Safari, Edge)
- Code editor (VS Code recommended)

### Initial Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/latentforge.git
cd latentforge

# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

### Project Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run build        # Build for production
npm run preview      # Preview production build locally

# Code Quality
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript compiler check

# Testing (when implemented)
npm test             # Run unit tests
npm run test:e2e     # Run end-to-end tests
```

### Recommended VS Code Extensions

- **TypeScript and JavaScript Language Features** (built-in)
- **ES Lint**: Real-time linting
- **Tailwind CSS IntelliSense**: Autocomplete for Tailwind classes
- **Prettier**: Code formatting
- **Error Lens**: Inline error highlighting

### Branch Naming

- `feature/short-description` - New features
- `fix/issue-description` - Bug fixes
- `docs/what-changed` - Documentation updates
- `refactor/component-name` - Code refactoring

---

## Questions?

Feel free to open a GitHub Discussion for any questions not covered here. We're here to help!

---

**Happy hacking! 🔥**

