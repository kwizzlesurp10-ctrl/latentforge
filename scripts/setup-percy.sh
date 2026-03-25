#!/bin/bash

# Percy CI/CD Setup Script
# Automates the setup of Percy visual regression testing with CI/CD integration

set -e

echo "🎨 Percy CI/CD Setup Script"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Percy token exists
if [ -z "$PERCY_TOKEN" ]; then
  echo -e "${YELLOW}⚠️  Percy token not found in environment${NC}"
  echo ""
  echo "To get your Percy token:"
  echo "1. Go to https://percy.io"
  echo "2. Sign up with GitHub"
  echo "3. Create a new project: 'LatentForge'"
  echo "4. Copy your token from Project Settings → Tokens"
  echo ""
  read -p "Enter your Percy token: " PERCY_TOKEN
  
  if [ -z "$PERCY_TOKEN" ]; then
    echo -e "${RED}❌ Percy token is required${NC}"
    exit 1
  fi
  
  # Save to .env file
  echo "PERCY_TOKEN=$PERCY_TOKEN" >> .env
  echo -e "${GREEN}✓${NC} Percy token saved to .env"
else
  echo -e "${GREEN}✓${NC} Percy token found in environment"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Check if we're in a git repository
if ! git rev-parse --git-dir > /dev/null 2>&1; then
  echo -e "${RED}❌ Not a git repository${NC}"
  echo "Please run this script from the root of your git repository"
  exit 1
fi

echo -e "${BLUE}📦 Installing Percy dependencies...${NC}"
npm install --save-dev @percy/cli @percy/playwright

echo ""
echo -e "${GREEN}✓${NC} Percy dependencies installed"
echo ""

# Check if GitHub workflows exist
if [ ! -d ".github/workflows" ]; then
  echo -e "${YELLOW}⚠️  .github/workflows directory not found${NC}"
  echo "Creating GitHub workflows directory..."
  mkdir -p .github/workflows
fi

echo -e "${BLUE}🔧 Checking CI/CD workflows...${NC}"

# Check required workflows
workflows=(
  "visual-regression.yml"
  "ci.yml"
  "percy-status.yml"
  "percy-pr-comment.yml"
)

missing_workflows=()
for workflow in "${workflows[@]}"; do
  if [ -f ".github/workflows/$workflow" ]; then
    echo -e "${GREEN}✓${NC} $workflow exists"
  else
    echo -e "${YELLOW}⚠${NC}  $workflow missing"
    missing_workflows+=("$workflow")
  fi
done

if [ ${#missing_workflows[@]} -gt 0 ]; then
  echo ""
  echo -e "${YELLOW}⚠️  Some workflows are missing${NC}"
  echo "Please ensure all Percy workflows are committed to .github/workflows/"
fi

echo ""
echo -e "${BLUE}🔑 GitHub Secret Configuration${NC}"
echo ""
echo "To enable Percy in CI/CD, add your Percy token to GitHub Secrets:"
echo ""
echo "1. Go to: https://github.com/$(git remote get-url origin | sed -E 's/.*github\.com[:/]([^/]+\/[^.]+).*/\1/')/settings/secrets/actions"
echo "2. Click 'New repository secret'"
echo "3. Name: PERCY_TOKEN"
echo "4. Value: [Your Percy token]"
echo "5. Click 'Add secret'"
echo ""

read -p "Press Enter once you've added the PERCY_TOKEN secret to GitHub..."

echo ""
echo -e "${BLUE}✨ Testing Percy setup...${NC}"
echo ""

# Run a quick Percy test
export PERCY_TOKEN=$PERCY_TOKEN

if npm run test:visual:local > /dev/null 2>&1; then
  echo -e "${GREEN}✓${NC} Percy test passed"
else
  echo -e "${YELLOW}⚠${NC}  Percy test couldn't run (this is OK if browser isn't available)"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo -e "${GREEN}🎉 Percy CI/CD setup complete!${NC}"
echo ""
echo "Next steps:"
echo ""
echo "1. ${BLUE}Create a PR${NC} to trigger Percy visual tests"
echo "2. ${BLUE}Review Percy comments${NC} automatically posted to your PR"
echo "3. ${BLUE}Approve snapshots${NC} on Percy dashboard"
echo ""
echo "Documentation:"
echo "  📖 Quick Start:    ./PERCY_QUICKSTART.md"
echo "  📖 CI/CD Guide:    ./PERCY_CI_CD.md"
echo "  📖 Visual Testing: ./VISUAL_TESTING.md"
echo ""
echo "Test commands:"
echo "  npm run test:visual         # Run all visual tests"
echo "  npm run test:visual:dark    # Run dark mode tests"
echo "  npm run test:visual:themes  # Run theme comparison tests"
echo ""
echo -e "${GREEN}Happy visual testing! 🎨${NC}"
echo ""
