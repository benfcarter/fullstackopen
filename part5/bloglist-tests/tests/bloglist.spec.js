const { test, expect, beforeEach, describe } = require('@playwright/test')

const testLogin = async (page) => {
  await page.getByRole('textbox').first().fill('root')
  await page.getByRole('textbox').last().fill('sekret')
  await page.getByRole('button', { name: 'login' }).click()
}

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
      await testLogin(page)

      await expect(page.getByText('Logged in as root')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await page.getByRole('textbox').first().fill('bad')
      await page.getByRole('textbox').last().fill('credentials')
      await page.getByRole('button', { name: 'login' }).click()

      await expect(page.getByText('Logged in as')).not.toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await testLogin(page)
    })

    test('a new blog can be created', async ({ page }) => {
      await page.getByRole('button', { name: 'new blog' }).click()
      await expect(page.getByText('create new')).toBeVisible()

      const title = 'Newest Blog'

      await page.getByTestId('title').fill(title)
      await page.getByTestId('author').fill('Author Authorson')
      await page.getByTestId('url').fill('google')
      await page.getByTestId('createBlogButton').click()

      await expect(page.getByTestId('blogEntry')).toBeVisible()
      await expect(page.getByTestId('blogEntry').getByText(title)).toBeVisible()
    })
  })
})