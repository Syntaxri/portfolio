/* eslint-disable react-hooks/rules-of-hooks */
import { test as base, expect, type Page } from '@playwright/test'

/**
 * Wait for any loading/entrance overlays (such as Preloader) to dismiss,
 * and as a safety net, dismiss the ShortcutModal if it unexpectedly appears.
 */
export async function waitForOverlays(page: Page) {
  // 1. Wait for entrance preloader (z-[200]) to clear
  const preloader = page.locator('[data-testid="preloader"], .door-star')
  try {
    if (await preloader.first().isVisible({ timeout: 500 })) {
      // Trigger skip on preloader to speed up test execution
      await page.keyboard.press('Space').catch(() => {})
      await preloader.first().waitFor({ state: 'detached', timeout: 5_000 })
    }
  } catch {
    // Already detached or not present
  }

  // 2. Safety net: Dismiss shortcut modal if unexpectedly present
  const shortcutModal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
  try {
    if (await shortcutModal.isVisible({ timeout: 500 })) {
      const closeBtn = page.locator('button[aria-label="Close shortcuts modal"]')
      if (await closeBtn.isVisible({ timeout: 300 })) {
        await closeBtn.click()
        await shortcutModal.waitFor({ state: 'detached', timeout: 3_000 })
      } else {
        await page.keyboard.press('Escape')
        await shortcutModal.waitFor({ state: 'detached', timeout: 3_000 })
      }
    }
  } catch {
    // Safety net: not present
  }
}

export const test = base.extend<{
  waitForOverlays: () => Promise<void>
}>({
  page: async ({ page }, use) => {
    const originalGoto = page.goto.bind(page)
    page.goto = async (url, options) => {
      const res = await originalGoto(url, options)
      await waitForOverlays(page)
      return res
    }
    await use(page)
  },
  waitForOverlays: async ({ page }, use) => {
    await use(() => waitForOverlays(page))
  },
})

export { expect }
