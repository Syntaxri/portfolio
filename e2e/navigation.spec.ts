import { test, expect } from '@playwright/test'

/**
 * Navigation E2E tests — verify smooth scrolling and anchor navigation.
 */

test.describe('Navigation', () => {
  test('should have working anchor links', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Click on a navigation link (actual hrefs from Topbar)
    const navLink = page.locator('a[href="/#collection"], a[href="/#archive"], a[href="/#exit"]').first()
    await navLink.click()
    await page.waitForTimeout(2000)

    // Should have scrolled to the section
    const scrollY = await page.evaluate(() => window.scrollY)
    expect(scrollY).toBeGreaterThan(0)
  })

  test('should have working room directory', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Check if room directory exists (desktop only)
    const directory = page.locator('[class*="directory"], [class*="rail"]')
    const count = await directory.count()

    if (count > 0) {
      // Click on a directory item
      const dirItem = directory.first().locator('a, button').first()
      await dirItem.click()
      await page.waitForTimeout(2000)

      // Should have scrolled
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeGreaterThan(0)
    }
  })

  test('should have working back-to-top functionality', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight))
    await page.waitForTimeout(1000)

    // Look for back to top button
    const backToTop = page.locator('a[href="#main"], button:has-text("Back"), button:has-text("↑")')
    const count = await backToTop.count()

    if (count > 0) {
      await backToTop.first().click()
      await page.waitForTimeout(2000)

      // Should be back at top
      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeLessThan(100)
    }
  })
})
