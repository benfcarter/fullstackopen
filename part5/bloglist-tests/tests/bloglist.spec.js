const { test, expect, beforeEach, describe } = require('@playwright/test')

const baseUrl = 'http://localhost:5173/api'

const createUser = async(request, name, username, password) => {
  await request.post(`${baseUrl}/users`, {
    data: {
      name: name,
      username: username,
      password: password
    }
  })
}

const testLogin = async (page, username, password) => {
  await page.getByRole('textbox').first().fill(username)
  await page.getByRole('textbox').last().fill(password)
  await page.getByRole('button', { name: 'login' }).click()
}

const testLogout = async (page) => {
  await page.getByRole('button', { name: 'log out'}).click()
}

const createBlog = async(page, title, author, url) => {
  await page.getByRole('button', { name: 'new blog' }).click()

  await page.getByTestId('title').fill(title)
  await page.getByTestId('author').fill(author)
  await page.getByTestId('url').fill(url)
  await page.getByTestId('createBlogButton').click()

  await expect(page.getByTestId('blogEntry').getByText(title)).toBeVisible()
}

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post(`${baseUrl}/testing/reset`)

    await createUser(request, 'Test Testington', 'root', 'sekret')
    await createUser(request, 'Other Guy', 'root2', 'boogaloo')
    
    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    const locator = await page.getByText('log in')
    await expect(locator).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async({ page }) => {
      await testLogin(page, 'root', 'sekret')

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
      await testLogin(page, 'root', 'sekret')
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

    test('a blog can be deleted', async ({ page }) => {
      await createBlog(page, 'title', 'Author Authorson', 'google')

      page.on('dialog', dialog => dialog.accept())

      await page.getByTestId('blogEntry').first()
      await page.getByRole('button', { name: 'show' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByTestId('blogEntry')).not.toBeVisible()
    })
    
    test('a blog cannot be deleted by a different user', async ({ page }) => {
      await createBlog(page, 'title', 'Author Authorson', 'google')
      await testLogout(page)

      await testLogin(page, 'root2', 'boogaloo')

      await page.getByTestId('blogEntry').first()
      await page.getByTestId('showDetails').click()

      await expect(page.getByRole('button', { name: 'remove' })).not.toBeVisible()
    })

    test('blogs are shown in descending order of likes', async ({ page }) => {
      await createBlog(page, 'blog1', 'author1', 'url1')
      await createBlog(page, 'blog2', 'author2', 'url2')
      await createBlog(page, 'blog3', 'author3', 'url3')

      const blogEntriesBefore = await page.getByTestId('blogEntry').all()

      await blogEntriesBefore[0].getByTestId('showDetails').click()
      const likeButton1 = await blogEntriesBefore[0].getByRole('button', { name: 'like' })
      await blogEntriesBefore[1].getByTestId('showDetails').click()
      const likeButton2 = await blogEntriesBefore[1].getByRole('button', { name: 'like' })
      await blogEntriesBefore[2].getByTestId('showDetails').click()
      const likeButton3 = await blogEntriesBefore[2].getByRole('button', { name: 'like' })

      await likeButton2.click()
      await likeButton2.click()
      await likeButton3.click()

      const blogEntriesAfter = await page.getByTestId('blogEntry').all()
      await expect(blogEntriesAfter[0].getByText('blog2')).toBeVisible()
      await expect(blogEntriesAfter[1].getByText('blog3')).toBeVisible()
      await expect(blogEntriesAfter[2].getByText('blog1')).toBeVisible()
    })
  })
})