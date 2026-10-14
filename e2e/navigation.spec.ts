import { test, expect } from '@playwright/test'

const CLICK_TIMEOUT = 15_000

test.describe('Navigation', () => {
  test('should have working anchor links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const navLink = page
      .locator('a[href="/#collection"], a[href="/#archive"], a[href="/#exit"]')
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
      await page.waitForTimeout(2000)

      const scrollY = await page.evaluate(() => window.scrollY)
      expect(scrollY).toBeLessThan(100)
    }
  })
})
