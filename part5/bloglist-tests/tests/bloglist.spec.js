const { test, expect, beforeEach, describe } = require('@playwright/test')

const testLogin = async (page) => {
  await page.getByRole('textbox').first().fill('root')
  await page.getByRole('textbox').last().fill('sekret')
  await page.getByRole('button', { name: 'login' }).click()
}

const createBlog = async(page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill('Author Authorson')
  await page.getByTestId('url').fill('google')
  await page.getByTestId('createBlogButton').click()
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
      const title = 'Newest Blog'

      await createBlog(page, title, 'Author Authorson', 'google')

      await expect(page.getByTestId('blogEntry')).toBeVisible()
      await expect(page.getByTestId('blogEntry').getByText(title)).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'title', 'author', 'google')

      const blogEntry = await page.getByTestId('blogEntry').first()
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'like' }).click()
    
      await expect(page.getByText('likes 1')).toBeVisible()
    })
  })
})