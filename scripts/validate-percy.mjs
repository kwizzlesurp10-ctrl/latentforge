#!/usr/bin/env node

/**
 * Percy Configuration Validator
 * 
 * Validates Percy setup and configuration for CI/CD integration.
 * Checks workflows, config files, and environment setup.
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const rootDir = path.resolve(__dirname, '..');

const REQUIRED_FILES = [
  '.percyrc.yml',
  'playwright.config.ts',
  '.github/workflows/visual-regression.yml',
  '.github/workflows/ci.yml',
  '.github/workflows/percy-status.yml',
  '.github/workflows/percy-pr-comment.yml',
];

const REQUIRED_SCRIPTS = [
  'test:visual',
  'test:visual:dark',
  'test:visual:themes',
  'test:e2e',
];

const REQUIRED_PACKAGES = [
  '@percy/cli',
  '@percy/playwright',
  '@playwright/test',
];

class PercyValidator {
  constructor() {
    this.errors = [];
    this.warnings = [];
    this.info = [];
  }

  log(level, message, details = null) {
    const entry = { level, message, details };
    
    if (level === 'error') {
      this.errors.push(entry);
      console.error(`❌ ${message}`);
    } else if (level === 'warning') {
      this.warnings.push(entry);
      console.warn(`⚠️  ${message}`);
    } else {
      this.info.push(entry);
      console.log(`✓  ${message}`);
    }
    
    if (details) {
      console.log(`   ${details}`);
    }
  }

  checkFile(filePath) {
    const fullPath = path.join(rootDir, filePath);
    
    if (fs.existsSync(fullPath)) {
      this.log('info', `Found ${filePath}`);
      return true;
    } else {
      this.log('error', `Missing ${filePath}`, 'This file is required for Percy to work properly');
      return false;
    }
  }

  checkPackageJson() {
    const packagePath = path.join(rootDir, 'package.json');
    
    if (!fs.existsSync(packagePath)) {
      this.log('error', 'package.json not found');
      return false;
    }

    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf-8'));
    
    // Check scripts
    const missingScripts = REQUIRED_SCRIPTS.filter(script => !packageJson.scripts?.[script]);
    
    if (missingScripts.length > 0) {
      this.log('error', 'Missing required npm scripts', `Missing: ${missingScripts.join(', ')}`);
    } else {
      this.log('info', 'All required npm scripts found');
    }
    
    // Check packages
    const allPackages = { ...packageJson.dependencies, ...packageJson.devDependencies };
    const missingPackages = REQUIRED_PACKAGES.filter(pkg => !allPackages[pkg]);
    
    if (missingPackages.length > 0) {
      this.log('error', 'Missing required packages', `Run: npm install --save-dev ${missingPackages.join(' ')}`);
    } else {
      this.log('info', 'All required packages installed');
    }
    
    return missingScripts.length === 0 && missingPackages.length === 0;
  }

  checkEnvironment() {
    if (process.env.PERCY_TOKEN) {
      this.log('info', 'PERCY_TOKEN environment variable is set');
      return true;
    } else {
      this.log('warning', 'PERCY_TOKEN not set in environment', 
        'Set it with: export PERCY_TOKEN=your_token_here');
      return false;
    }
  }

  checkPercyConfig() {
    const configPath = path.join(rootDir, '.percyrc.yml');
    
    if (!fs.existsSync(configPath)) {
      this.log('error', '.percyrc.yml not found');
      return false;
    }
    
    const config = fs.readFileSync(configPath, 'utf-8');
    
    // Check key configuration elements
    const checks = [
      { pattern: /widths:/, message: 'Viewport widths configured' },
      { pattern: /percy-css:/, message: 'Percy CSS overrides configured' },
      { pattern: /enable-javascript: true/, message: 'JavaScript enabled' },
      { pattern: /wait-for-selector:/, message: 'Wait selector configured' },
    ];
    
    let allChecksPass = true;
    
    for (const check of checks) {
      if (check.pattern.test(config)) {
        this.log('info', check.message);
      } else {
        this.log('warning', `Missing configuration: ${check.message}`);
        allChecksPass = false;
      }
    }
    
    return allChecksPass;
  }

  checkGitHubWorkflows() {
    const workflowsDir = path.join(rootDir, '.github/workflows');
    
    if (!fs.existsSync(workflowsDir)) {
      this.log('error', '.github/workflows directory not found');
      return false;
    }
    
    const workflows = fs.readdirSync(workflowsDir).filter(f => f.endsWith('.yml') || f.endsWith('.yaml'));
    
    this.log('info', `Found ${workflows.length} GitHub workflows`);
    
    // Check if visual regression workflow exists
    const hasVisualRegression = workflows.some(w => w.includes('visual') || w.includes('percy'));
    
    if (hasVisualRegression) {
      this.log('info', 'Visual regression workflow found');
    } else {
      this.log('error', 'No Percy/visual regression workflow found');
      return false;
    }
    
    return true;
  }

  checkPlaywrightConfig() {
    const configPath = path.join(rootDir, 'playwright.config.ts');
    
    if (!fs.existsSync(configPath)) {
      this.log('error', 'playwright.config.ts not found');
      return false;
    }
    
    const config = fs.readFileSync(configPath, 'utf-8');
    
    // Check for visual test project
    if (config.includes('e2e/visual') || config.includes('visual')) {
      this.log('info', 'Visual test configuration found in Playwright config');
    } else {
      this.log('warning', 'No explicit visual test configuration in Playwright');
    }
    
    return true;
  }

  async run() {
    console.log('🎨 Percy Configuration Validator\n');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('Checking required files...\n');
    for (const file of REQUIRED_FILES) {
      this.checkFile(file);
    }
    
    console.log('\nChecking package.json...\n');
    this.checkPackageJson();
    
    console.log('\nChecking Percy configuration...\n');
    this.checkPercyConfig();
    
    console.log('\nChecking Playwright configuration...\n');
    this.checkPlaywrightConfig();
    
    console.log('\nChecking GitHub workflows...\n');
    this.checkGitHubWorkflows();
    
    console.log('\nChecking environment...\n');
    this.checkEnvironment();
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Summary
    console.log('📊 Summary:\n');
    console.log(`   ✓  Passed:   ${this.info.length}`);
    console.log(`   ⚠️  Warnings: ${this.warnings.length}`);
    console.log(`   ❌ Errors:   ${this.errors.length}`);
    
    console.log('\n');
    
    if (this.errors.length === 0 && this.warnings.length === 0) {
      console.log('🎉 Percy configuration is valid!\n');
      console.log('Ready to run visual tests:\n');
      console.log('  npm run test:visual\n');
      return 0;
    } else if (this.errors.length === 0) {
      console.log('✅ Percy configuration is mostly valid\n');
      console.log('There are some warnings but Percy should work.\n');
      return 0;
    } else {
      console.log('❌ Percy configuration has errors\n');
      console.log('Please fix the errors above before running Percy tests.\n');
      
      if (this.warnings.length > 0) {
        console.log('Also consider addressing the warnings for optimal performance.\n');
      }
      
      return 1;
    }
  }
}

// Run validator
const validator = new PercyValidator();
validator.run().then(exitCode => {
  process.exit(exitCode);
});
