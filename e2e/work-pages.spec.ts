import { test, expect } from '@playwright/test'

/**
 * Work/case-study pages E2E tests.
 */

test.describe('Work Pages', () => {
  test('should redirect /work to home collection', async ({ page }) => {
    const response = await page.goto('/work')
    await page.waitForTimeout(4000)

    // Should redirect to home page
    expect(page.url()).toMatch(/\/#collection$/)
  })

  test('should render case study pages for each project', async ({ page }) => {
    const slugs = [
      'wisla-platform',
      'palais-amghass',
      'nexthobby',
      'auto-ecole-michlifen',
      'azrou-design',
      'le-sapin',
    ]

    for (const slug of slugs) {
      await page.goto(`/work/${slug}`)
      await page.waitForTimeout(2000)

      // Should render the page (not 404)
      const notFound = page.locator('text=/404|not found|unnumbered/i')
      const notFoundCount = await notFound.count()
      expect(notFoundCount).toBe(0)

      // Should have some content
      const main = page.locator('main')
      await expect(main).toBeAttached()
    }
  })

  test('should show 404 for unknown work slugs', async ({ page }) => {
    await page.goto('/work/nonexistent-project')
    await page.waitForTimeout(2000)

    // Should show 404 content
    const notFound = page.locator('text=/404|not found|unnumbered/i')
    const count = await notFound.count()
    expect(count).toBeGreaterThan(0)
  })
})
