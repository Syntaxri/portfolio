import { test, expect } from '@playwright/test'

/**
 * Home page E2E tests — verify the museum loads and all rooms render.
 */

test.describe('Home Page', () => {
  test('should load the home page with all rooms', async ({ page }) => {
    await page.goto('/')

    // Wait for the preloader to finish (or timeout)
    await page.waitForTimeout(4000)

    // Verify all room sections exist (actual IDs from components)
    const roomIds = [
      'entrance',   // EntranceScene
      'living',     // LivingRoom
      'courtyard',  // Fountain
      'craft',      // Workshop
      'loom',       // LoomRoom
      'collection', // Collection
      'archive',    // Archive
      'exit',       // ExitRoom
    ]

    for (const id of roomIds) {
      const element = page.locator(`#${id}`)
      await expect(element).toBeAttached()
    }
  })

  test('should display the hero section with key content', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Check for hero content
    await expect(page.getByText(/Akram Rihani/i).first()).toBeVisible()
  })

  test('should have working navigation links', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Check that nav links exist
    const nav = page.locator('nav, [role="navigation"]')
    await expect(nav.first()).toBeAttached()
  })

  test('should render the contact form', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Scroll to the exit room (contact form)
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(1000)

    // Check for form elements
    const nameInput = page.locator('input[name="name"], input[type="text"]').first()
    await expect(nameInput).toBeAttached()
  })

  test('should have working social links', async ({ page }) => {
    await page.goto('/')
    await page.waitForTimeout(4000)

    // Check for social links in footer
    const socialLinks = page.locator('a[href*="github"], a[href*="linkedin"], a[href*="instagram"]')
    const count = await socialLinks.count()
    expect(count).toBeGreaterThan(0)
  })
})
