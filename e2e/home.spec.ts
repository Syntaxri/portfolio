import { test, expect } from '@playwright/test'

/**
 * Home page E2E tests — verify the museum loads and all rooms render.
 */

const NAV_TIMEOUT = 15_000

test.describe('Home Page', () => {
  test('should load the home page with all rooms', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    // Verify all room sections exist (actual IDs from components)
    const roomIds = [
      'entrance',
      'living',
      'courtyard',
      'craft',
      'loom',
      'collection',
      'archive',
      'exit',
    ]

    for (const id of roomIds) {
      const element = page.locator(`#${id}`)
      await expect(element).toBeAttached({ timeout: NAV_TIMEOUT })
    }
  })

  test('should display the hero section with key content', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const hero = page.getByText(/Akram Rihani/i).first()
    await hero.waitFor({ state: 'visible', timeout: NAV_TIMEOUT })
    await expect(hero).toBeVisible({ timeout: NAV_TIMEOUT })
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const nav = page.locator('nav, [role="navigation"]')
    await nav.first().waitFor({ state: 'attached', timeout: NAV_TIMEOUT })
    await expect(nav.first()).toBeAttached()
  })

  test('should render the contact form', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(1000)

    const nameInput = page.locator('input[name="name"], input[type="text"]').first()
    await expect(nameInput).toBeAttached({ timeout: NAV_TIMEOUT })
  })

  test('should have working social links', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const socialLinks = page.locator(
      'a[href*="github"], a[href*="linkedin"], a[href*="instagram"]',
    )
    const count = await socialLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})
