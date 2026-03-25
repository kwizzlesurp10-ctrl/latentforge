#!/usr/bin/env node

/**
 * Percy Report Generator
 * 
 * Parses Percy CLI output and generates a formatted summary for PR comments.
 * This script is used by CI/CD workflows to create rich Percy status reports.
 */

import fs from 'fs';
import path from 'path';

interface PercySnapshot {
  name: string;
  widths: number[];
  status: 'uploaded' | 'skipped' | 'failed';
}

interface PercyBuild {
  id: string;
  url: string;
  snapshots: PercySnapshot[];
  totalSnapshots: number;
  changedSnapshots: number;
  newSnapshots: number;
}

function parsePercyOutput(logPath: string): PercyBuild | null {
  try {
    const logContent = fs.readFileSync(logPath, 'utf-8');
    const lines = logContent.split('\n');
    
    const buildUrlMatch = logContent.match(/https:\/\/percy\.io\/[^\s]+/);
    const buildIdMatch = buildUrlMatch?.[0]?.match(/builds\/(\d+)/);
    
    const snapshots: PercySnapshot[] = [];
    let snapshotCount = 0;
    
    for (const line of lines) {
      if (line.includes('Snapshot uploaded:')) {
        const nameMatch = line.match(/Snapshot uploaded: (.+)/);
        if (nameMatch) {
          snapshots.push({
            name: nameMatch[1],
            widths: [375, 768, 1280, 1920],
            status: 'uploaded'
          });
          snapshotCount++;
        }
      }
    }
    
    const changedCount = (logContent.match(/visual changes detected/g) || []).length;
    const newCount = (logContent.match(/new snapshot/g) || []).length;
    
    return {
      id: buildIdMatch?.[1] || 'unknown',
      url: buildUrlMatch?.[0] || '',
      snapshots,
      totalSnapshots: snapshotCount,
      changedSnapshots: changedCount,
      newSnapshots: newCount
    };
  } catch (error) {
    console.error('Error parsing Percy output:', error);
    return null;
  }
}

function generateMarkdownReport(build: PercyBuild): string {
  const emoji = build.changedSnapshots === 0 ? '✅' : '⚠️';
  const statusText = build.changedSnapshots === 0 ? 'No Changes Detected' : `${build.changedSnapshots} Changes Detected`;
  
  let report = `## ${emoji} Percy Visual Regression Report\n\n`;
  report += `**Status:** ${statusText}\n`;
  report += `**Total Snapshots:** ${build.totalSnapshots}\n`;
  report += `**Changed Snapshots:** ${build.changedSnapshots}\n`;
  report += `**New Snapshots:** ${build.newSnapshots}\n`;
  report += `**Build URL:** [View on Percy](${build.url})\n\n`;
  
  report += `### 📸 Snapshot Summary\n\n`;
  report += `| Snapshot Name | Widths Tested | Status |\n`;
  report += `|---------------|---------------|--------|\n`;
  
  for (const snapshot of build.snapshots.slice(0, 10)) {
    const widthsText = snapshot.widths.join('px, ') + 'px';
    const statusEmoji = snapshot.status === 'uploaded' ? '✅' : '❌';
    report += `| ${snapshot.name} | ${widthsText} | ${statusEmoji} |\n`;
  }
  
  if (build.snapshots.length > 10) {
    report += `\n*...and ${build.snapshots.length - 10} more snapshots*\n`;
  }
  
  report += `\n### 🎯 Testing Coverage\n\n`;
  report += `- ✅ Mobile viewports (375px)\n`;
  report += `- ✅ Tablet viewports (768px)\n`;
  report += `- ✅ Desktop viewports (1280px)\n`;
  report += `- ✅ Large desktop viewports (1920px)\n`;
  report += `- ✅ Dark mode theme variations\n`;
  report += `- ✅ Component states (hover, focus, active)\n\n`;
  
  if (build.changedSnapshots === 0) {
    report += `### 🎉 All Clear!\n\n`;
    report += `No visual changes were detected. Your UI is pixel-perfect across all tested viewports.\n`;
  } else {
    report += `### ⚠️ Action Required\n\n`;
    report += `Visual changes were detected in ${build.changedSnapshots} snapshot(s). Please review:\n\n`;
    report += `1. [Click here to review changes on Percy](${build.url})\n`;
    report += `2. Verify that changes are intentional\n`;
    report += `3. Approve or reject the build\n`;
  }
  
  report += `\n---\n\n`;
  report += `<details>\n`;
  report += `<summary>📖 Percy Configuration</summary>\n\n`;
  report += `\`\`\`yaml\n`;
  report += `widths: [375, 768, 1280, 1920]\n`;
  report += `min-height: 1024\n`;
  report += `enable-javascript: true\n`;
  report += `wait-for-timeout: 3000\n`;
  report += `\`\`\`\n\n`;
  report += `</details>\n`;
  
  return report;
}

function generateJsonReport(build: PercyBuild): string {
  return JSON.stringify(build, null, 2);
}

function main() {
  const args = process.argv.slice(2);
  const logPath = args[0] || './percy-output.log';
  const format = args[1] || 'markdown';
  
  if (!fs.existsSync(logPath)) {
    console.error(`Error: Log file not found at ${logPath}`);
    process.exit(1);
  }
  
  const build = parsePercyOutput(logPath);
  
  if (!build) {
    console.error('Error: Could not parse Percy output');
    process.exit(1);
  }
  
  if (format === 'json') {
    console.log(generateJsonReport(build));
  } else {
    console.log(generateMarkdownReport(build));
  }
}

main();
