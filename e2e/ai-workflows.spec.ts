import { test, expect } from '@playwright/test'

test.describe('AI Preview Workflows', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should show AI preview when vault item is selected', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Test content for AI preview')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Test content for AI preview').click()
    
    await expect(page.getByText('AI Preview')).toBeVisible()
    await expect(page.getByText('Refine')).toBeVisible()
    await expect(page.getByText('Expand')).toBeVisible()
    await expect(page.getByText('Extract')).toBeVisible()
    await expect(page.getByText('Transform')).toBeVisible()
  })

  test('should show AI preview when canvas node is selected', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    await page.getByPlaceholder('Type your idea...').fill('Canvas node content')
    
    const node = page.getByText('Canvas node content')
    await node.click()
    
    await expect(page.getByText('AI Preview')).toBeVisible()
  })

  test('should switch between AI preview modes', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Content for mode testing')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Content for mode testing').click()
    
    await page.getByRole('tab', { name: 'Expand' }).click()
    await expect(page.getByRole('tab', { name: 'Expand' })).toHaveAttribute('data-state', 'active')
    
    await page.getByRole('tab', { name: 'Extract' }).click()
    await expect(page.getByRole('tab', { name: 'Extract' })).toHaveAttribute('data-state', 'active')
    
    await page.getByRole('tab', { name: 'Transform' }).click()
    await expect(page.getByRole('tab', { name: 'Transform' })).toHaveAttribute('data-state', 'active')
  })

  test('should show generating state', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Testing AI generation')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Testing AI generation').click()
    
    await expect(page.getByText('Generating...')).toBeVisible({ timeout: 2000 })
  })

  test('should display AI generated content', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('AI content test')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('AI content test').click()
    
    await expect(page.getByText(/Mocked AI response/i)).toBeVisible({ timeout: 5000 })
  })

  test('should copy AI preview content', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Copy test content')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Copy test content').click()
    
    await page.waitForSelector('text=Mocked AI response', { timeout: 5000 })
    
    await page.getByRole('button', { name: /Copy/i }).click()
    
    await expect(page.getByText('Copied')).toBeVisible({ timeout: 2000 })
  })

  test('should regenerate AI preview', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Regenerate test')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Regenerate test').click()
    
    await page.waitForSelector('text=Mocked AI response', { timeout: 5000 })
    
    await page.getByRole('button', { name: /Regenerate/i }).click()
    
    await expect(page.getByText('Generating...')).toBeVisible()
  })

  test('should close AI preview panel', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Close panel test')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Close panel test').click()
    await expect(page.getByText('AI Preview')).toBeVisible()
    
    await page.getByRole('button', { name: '×' }).click()
    
    await expect(page.getByText('AI Preview')).not.toBeVisible()
  })

  test('should show different preview types for different content types', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    
    await page.getByPlaceholder(/Capture your idea/i).fill('```\nconst test = 42;\n```')
    
    const typeSelect = page.locator('[role="combobox"]').first()
    await typeSelect.click()
    await page.getByRole('option', { name: 'code' }).click()
    
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('const test = 42').click()
    
    await expect(page.getByText('code')).toBeVisible()
  })
})
