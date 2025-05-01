const { test, expect, beforeEach, describe } = require('@playwright/test')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    const baseUrl = 'http://localhost:5173/api'
    await request.post(`${baseUrl}/testing/reset`)
    await request.post(`${baseUrl}/users`, {
      data: {
        name: 'Test Testington',
        username: 'root',
        password: 'sekret'
      }
    })
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async({ page }) => {
      await page.getByRole('textbox').first().fill('root')
      await page.getByRole('textbox').last().fill('sekret')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Logged in as root')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('bad')
      await page.getByRole('textbox').last().fill('credentials')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Logged in as')).not.toBeVisible()
    })
  })
})