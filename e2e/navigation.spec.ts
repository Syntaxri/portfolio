import { test, expect } from '@playwright/test'

const CLICK_TIMEOUT = 15_000

test.describe('Navigation', () => {
  test('should have working anchor links', async ({ page, isMobile }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Dismiss the shortcut modal — its backdrop intercepts pointer events
    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    if (await modal.isVisible({ timeout: 15_000 })) {
      await page.locator('button[aria-label="Close shortcuts modal"]').click()
      await page.waitForTimeout(500)
    }

    // Mobile: open the hamburger directory dialog, then click a link inside it
    // Desktop: the links are directly visible in the topbar nav
    const navLink = isMobile
      ? page.locator('#room-menu a[href="/#collection"], #room-menu a[href="/#archive"], #room-menu a[href="/#exit"]').first()
      : page.locator('a[href="/#collection"], a[href="/#archive"], a[href="/#exit"]').first()

    if (isMobile) {
      const hamburger = page.locator('button[aria-label="Toggle the directory"]')
      await hamburger.waitFor({ state: 'visible', timeout: CLICK_TIMEOUT })
      await hamburger.click()
      await page.waitForTimeout(500)
    }

    await navLink.waitFor({ state: 'visible', timeout: CLICK_TIMEOUT })
    await navLink.scrollIntoViewIfNeeded()
    await navLink.click({ timeout: CLICK_TIMEOUT })
    await page.waitForTimeout(2000)

    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })

  test('should have working room directory', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const directory = page.locator('[class*="directory"], [class*="rail"]')
    const count = await directory.count()

    if (count > 0) {
      const dirItem = directory.first().locator('a, button').first()
      await dirItem.waitFor({ state: 'visible', timeout: CLICK_TIMEOUT })
      await dirItem.scrollIntoViewIfNeeded()
      await dirItem.click({ timeout: CLICK_TIMEOUT })
      await page.waitForTimeout(2000)

      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeGreaterThan(0)
    }
  })

  test('should have working back-to-top functionality', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Dismiss the shortcut modal — its backdrop intercepts pointer events
    const modal = page.locator('[role="dialog"][aria-label="Keyboard shortcuts"]')
    if (await modal.isVisible({ timeout: 15_000 })) {
      await page.locator('button[aria-label="Close shortcuts modal"]').click()
      await page.waitForTimeout(500)
    }

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    const backToTop = page.locator('a[href="#main"], button:has-text("Back"), button:has-text("↑")')
    const count = await backToTop.count()

    if (count > 0) {
      await backToTop.first().waitFor({ state: 'visible', timeout: CLICK_TIMEOUT })
      await backToTop.first().scrollIntoViewIfNeeded()
      await backToTop.first().click({ timeout: CLICK_TIMEOUT })
      // Wait for smooth scroll to settle
      await page.waitForTimeout(3000)

      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeLessThan(100)
    }
  })
})
