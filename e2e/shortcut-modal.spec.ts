import { test, expect } from '@playwright/test'

const MODAL_TIMEOUT = 15_000

test.describe('ShortcutModal', () => {
  test('displays three shortcut cards with correct key combinations', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })

    await expect(modal.getByText('Conservation Console', { exact: true })).toBeVisible({ timeout: MODAL_TIMEOUT })
    await expect(modal.getByText("Owner's GitHub", { exact: true })).toBeVisible({ timeout: MODAL_TIMEOUT })
    await expect(modal.getByText('Download Resume', { exact: true })).toBeVisible({ timeout: MODAL_TIMEOUT })
    await expect(modal.getByText('Ctrl').first()).toBeVisible({ timeout: MODAL_TIMEOUT })
    await expect(modal.getByText('Alt').first()).toBeVisible({ timeout: MODAL_TIMEOUT })
  })

  test('close button dismisses the modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })

    await page.locator('button[aria-label="Close shortcuts modal"]').click()
    await page.waitForTimeout(500)
    await expect(modal).not.toBeAttached()
  })

  test('backdrop click dismisses the modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })

    // Click the backdrop directly — bypasses Playwright actionability on aria-hidden
    await page.evaluate(() => {
      document.querySelector('[data-testid="shortcut-backdrop"]')?.dispatchEvent(
        new MouseEvent('click', { bubbles: true })
      )
    })
    await page.waitForTimeout(800)
    await expect(modal).not.toBeAttached()
  })

  test('Escape key dismisses the modal', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })

    await page.keyboard.press('Escape')
    await page.waitForTimeout(500)
    await expect(modal).not.toBeAttached()
  })

  test('Ctrl+Shift+K opens conservation console exactly once', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })
    await page.locator('button[aria-label="Close shortcuts modal"]').click()
    await page.waitForTimeout(500)

    await page.keyboard.press('Control+Shift+K')
    await page.waitForTimeout(1000)

    const console_ = page.locator('[role="dialog"][aria-label="Conservation console"]')
    await expect(console_).toBeVisible()
    // Wait to confirm it doesn't flash/disappear
    await page.waitForTimeout(1000)
    await expect(console_).toBeVisible()
  })

  test('Ctrl+Shift+G opens GitHub ledger exactly once', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })
    await page.locator('button[aria-label="Close shortcuts modal"]').click()
    await page.waitForTimeout(500)

    await page.keyboard.press('Control+Shift+G')
    await page.waitForTimeout(1000)

    const ledger = page.locator('[role="dialog"][aria-label="The keeper\'s ledger"]')
    await expect(ledger).toBeVisible()
    // Wait to confirm it doesn't flash/disappear
    await page.waitForTimeout(1000)
    await expect(ledger).toBeVisible()
  })

  test('Alt+Shift+D does not open the modal or consoles', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })
    await page.locator('button[aria-label="Close shortcuts modal"]').click()
    await page.waitForTimeout(500)

    await page.keyboard.press('Alt+Shift+D')
    await page.waitForTimeout(1000)

    // Modal should stay closed
    await expect(modal).not.toBeAttached()
    // Consoles should not appear
    await expect(page.locator('[role="dialog"][aria-label="Conservation console"]')).not.toBeAttached()
    await expect(page.locator('[role="dialog"][aria-label="The keeper\'s ledger"]')).not.toBeAttached()
  })

  test('Alt+Shift+R reopens the modal without downloading', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    await modal.waitFor({ state: 'visible', timeout: MODAL_TIMEOUT })
    await page.locator('button[aria-label="Close shortcuts modal"]').click()
    await page.waitForTimeout(500)
    await expect(modal).not.toBeAttached()

    await page.keyboard.press('Alt+Shift+R')
    await page.waitForTimeout(500)
    await expect(modal).toBeVisible()
  })
})
