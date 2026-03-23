import { test, expect } from '@playwright/test'

test.describe('Vault Sidebar', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
  })

  test('should toggle vault sidebar', async ({ page }) => {
    await expect(page.getByText('Shadow Vault')).toBeVisible()
    
    const toggleButton = page.getByRole('button').first()
    await toggleButton.click()
    
    await expect(page.getByText('Shadow Vault')).not.toBeVisible()
    
    await toggleButton.click()
    await expect(page.getByText('Shadow Vault')).toBeVisible()
  })

  test('should open quick capture dialog', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    
    await expect(page.getByRole('dialog')).toBeVisible()
    await expect(page.getByPlaceholder(/Capture your idea/i)).toBeVisible()
  })

  test('should create vault item via quick capture', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    
    await page.getByPlaceholder(/Capture your idea/i).fill('Test vault item from E2E')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await expect(page.getByText('Test vault item from E2E')).toBeVisible()
  })

  test('should switch between All and Tags tabs', async ({ page }) => {
    await expect(page.getByRole('tab', { name: 'All' })).toBeVisible()
    await expect(page.getByRole('tab', { name: 'Tags' })).toBeVisible()
    
    await page.getByRole('tab', { name: 'Tags' }).click()
    
    await expect(page.getByRole('tabpanel')).toBeVisible()
  })

  test('should select vault item', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Selectable item')
    await page.getByRole('button', { name: /Save/i }).click()
    
    await page.getByText('Selectable item').click()
    
    await expect(page.getByText('AI Preview')).toBeVisible()
  })

  test('should delete vault item', async ({ page }) => {
    await page.getByRole('button', { name: /Quick Capture/i }).click()
    await page.getByPlaceholder(/Capture your idea/i).fill('Item to delete')
    await page.getByRole('button', { name: /Save/i }).click()
    
    const itemCard = page.getByText('Item to delete').locator('xpath=ancestor::div[contains(@class, "group")]')
    await itemCard.hover()
    
    const deleteButton = itemCard.getByRole('button').filter({ hasText: '' }).first()
    await deleteButton.click()
    
    await expect(page.getByText('Item to delete')).not.toBeVisible()
  })

  test('should show empty state in vault', async ({ page }) => {
    await expect(page.getByText(/No items yet/i)).toBeVisible()
    await expect(page.getByText(/Press ⌘K to capture/i)).toBeVisible()
  })
})
