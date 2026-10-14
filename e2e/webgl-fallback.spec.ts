import { test, expect } from '@playwright/test'

const NAV_TIMEOUT = 15_000

test.describe('WebGL Fallback', () => {
  test('should render CSS fallback when WebGL is unavailable', async ({ page }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null as any
    })

    await page.goto('/', { waitUntil: 'networkidle' })

    const fallback = page.locator('.mosaic-fallback')
    await expect(fallback.first()).toBeAttached({ timeout: NAV_TIMEOUT })

    const main = page.locator('main')
    await expect(main).toBeAttached()

    // Use h1 (always visible) instead of the name span (hidden sm:inline on mobile)
    const h1 = page.locator('h1').first()
    await h1.waitFor({ state: 'visible', timeout: NAV_TIMEOUT })
    await expect(h1).toBeVisible()
  })

  test('should render all rooms even without WebGL', async ({ page }) => {
    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null as any
    })

    await page.goto('/', { waitUntil: 'networkidle' })

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

  test('should hide the fallback when WebGL succeeds', async ({ page }) => {
    await page.goto('/', { waitUntil: 'networkidle' })

    const fallback = page.locator('.mosaic-fallback').first()
    await expect(fallback).toBeAttached({ timeout: NAV_TIMEOUT })
    await expect(fallback).toHaveCSS('opacity', '0')
  })

  test('should not throw unexpected console errors when WebGL fails', async ({ page }) => {
    const consoleErrors: string[] = []
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text())
      }
    })

    await page.addInitScript(() => {
      HTMLCanvasElement.prototype.getContext = () => null as any
    })

    await page.goto('/', { waitUntil: 'networkidle' })

    // Allow known WebGL/Three.js errors from intentional GL failure
    const unexpectedErrors = consoleErrors.filter(
      (err) =>
        !err.includes('WebGL') &&
        !err.includes('webgl') &&
        !err.includes('THREE') &&
        !err.includes('GL_') &&
        !err.includes('GPU') &&
        !err.includes('GroupMarkerNotSet') &&
        !err.includes('Automatic fallback to software WebGL'),
    )

    expect(unexpectedErrors).toEqual([])
  })
})
