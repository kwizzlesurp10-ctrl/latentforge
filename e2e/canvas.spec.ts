import { test, expect } from '@playwright/test'

test.describe('Canvas Interactions', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should render the canvas with toolbar', async ({ page }) => {
    await expect(page.getByText('LatentForge')).toBeVisible()
    await expect(page.getByText('Text')).toBeVisible()
    await expect(page.getByText('Code')).toBeVisible()
    await expect(page.getByText('Image')).toBeVisible()
  })

  test('should add a text node to canvas', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    
    await expect(page.getByPlaceholder('Type your idea...')).toBeVisible()
    
    const textarea = page.getByPlaceholder('Type your idea...')
    await textarea.fill('This is a test node')
    
    await expect(page.getByText('This is a test node')).toBeVisible()
  })

  test('should add a code node to canvas', async ({ page }) => {
    await page.getByRole('button', { name: /Code/i }).click()
    
    await expect(page.getByPlaceholder('// Write code...')).toBeVisible()
    
    const textarea = page.getByPlaceholder('// Write code...')
    await textarea.fill('const test = 42;')
    
    await expect(page.getByText('const test = 42;')).toBeVisible()
  })

  test('should add multiple nodes to canvas', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    await page.getByRole('button', { name: /Code/i }).click()
    await page.getByRole('button', { name: /Image/i }).click()
    
    const textareas = page.getByRole('textbox')
    await expect(textareas).toHaveCount(3)
  })

  test('should select node on click', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    
    const node = page.getByPlaceholder('Type your idea...').locator('..')
    await node.click()
    
    await expect(node).toHaveClass(/border-primary/)
  })

  test('should delete node', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    
    const textarea = page.getByPlaceholder('Type your idea...')
    await textarea.fill('Delete me')
    
    const nodeCard = textarea.locator('xpath=ancestor::div[contains(@class, "group")]')
    await nodeCard.hover()
    
    const deleteButton = nodeCard.getByRole('button').filter({ hasText: '' }).first()
    await deleteButton.click()
    
    await expect(page.getByText('Delete me')).not.toBeVisible()
  })

  test('should update zoom level', async ({ page }) => {
    await expect(page.getByText('100%')).toBeVisible()
    
    await page.getByRole('button', { name: '+' }).click()
    await expect(page.getByText(/^1[0-9]{2}%$/)).toBeVisible()
    
    await page.getByRole('button', { name: '−' }).click()
    await expect(page.getByText('100%')).toBeVisible()
  })

  test('should drag node to new position', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    
    const node = page.getByPlaceholder('Type your idea...').locator('xpath=ancestor::div[contains(@class, "absolute")]')
    
    const boundingBox = await node.boundingBox()
    expect(boundingBox).not.toBeNull()
    
    await page.mouse.move(boundingBox!.x + 50, boundingBox!.y + 20)
    await page.mouse.down()
    await page.mouse.move(boundingBox!.x + 200, boundingBox!.y + 150, { steps: 10 })
    await page.mouse.up()
    
    const newBoundingBox = await node.boundingBox()
    expect(newBoundingBox).not.toEqual(boundingBox)
  })

  test('should persist nodes after page reload', async ({ page }) => {
    await page.getByRole('button', { name: /Text/i }).click()
    await page.getByPlaceholder('Type your idea...').fill('Persistent content')
    
    await page.reload()
    await page.waitForLoadState('networkidle')
    
    await expect(page.getByText('Persistent content')).toBeVisible()
  })

  test('should show empty state when no nodes exist', async ({ page }) => {
    await expect(page.getByText(/Click a button above to add your first node/i)).toBeVisible()
    await expect(page.getByText(/Scroll to pan/i)).toBeVisible()
  })
})
