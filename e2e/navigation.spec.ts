import { test, expect } from '@playwright/test'

const CLICK_TIMEOUT = 15_000

test.describe('Navigation', () => {
  test('should have working anchor links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // On mobile the desktop nav links are hidden behind a hamburger — open it first
    const isMobile = page.viewportSize()?.width !== undefined && page.viewportSize()!.width < 768
    if (isMobile) {
      const hamburger = page.locator('button[aria-label="Toggle the directory"]')
      await hamburger.waitFor({ state: 'visible', timeout: CLICK_TIMEOUT })
      await hamburger.click()
      await page.waitForTimeout(500)
    }

    const navLink = page
      .locator('#room-menu a[href="/#collection"], #room-menu a[href="/#archive"], #room-menu a[href="/#exit"]')
      .first()
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
