import { test, expect } from '@playwright/test'

/**
 * WebGL fallback E2E test — verifies the CSS fallback renders when
 * WebGL is unavailable, and that nothing throws.
 *
 * This is critical for a portfolio whose centerpiece is two raw
 * Three.js scenes. If WebGL fails (headless CI, older devices,
 * blocked GPU), the visitor should still see a designed fallback.
 */

test.describe('WebGL Fallback', () => {
  test('should render CSS fallback when WebGL is unavailable', async ({ page }) => {
    // Stub getContext to return null (simulates no WebGL)
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null as any
    })

    // Should load without throwing
    await page.goto('/')
    await page.waitForTimeout(4000)

    // The mosaic fallback should be visible
    const fallback = page.locator('.mosaic-fallback')
    await expect(fallback.first()).toBeAttached()

    // The page should still have content (not a blank screen)
    const main = page.locator('main')
    await expect(main).toBeAttached()

    // Key content should still be visible
    await expect(page.getByText(/Akram Rihani/i).first()).toBeVisible()
  })

  test('should render all rooms even without WebGL', async ({ page }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null as any
    })

    await page.goto('/')
    await page.waitForTimeout(4000)

    // All rooms should still be in the DOM
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
      await expect(element).toBeAttached()
    }
  })

  test('should hide the fallback when WebGL succeeds', async ({ page }) => {
    // Don't stub getContext — let WebGL work normally
    await page.goto('/')
    await page.waitForTimeout(4000)

    // The fallback should be in the DOM but hidden (opacity: 0)
    const fallback = page.locator('.mosaic-fallback').first()
    await expect(fallback).toBeAttached()
    await expect(fallback).toHaveCSS('opacity', '0')
  })

  test('should not throw console errors when WebGL fails', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null as any
    })

    await page.goto('/')
    await page.waitForTimeout(4000)

    // Filter out known benign errors (e.g., WebGL context creation failures)
    const criticalErrors = consoleErrors.filter(
      (err) =>
        !err.includes('WebGL') &&
        !err.includes('webgl') &&
        !err.includes('THREE') &&
        !err.includes('GL_') &&
        !err.includes('GPU')
    )

    // Should have no critical errors
    expect(criticalErrors).toEqual([])
  })
})
