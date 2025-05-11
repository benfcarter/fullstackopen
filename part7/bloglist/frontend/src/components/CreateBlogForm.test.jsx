import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CreateBlogForm from './CreateBlogForm'

test('new blog calls handle with correct props', async () => {
  const title = 'Test Title'
  const author = 'Test Author'
  const url = 'google'

  const mockHandleCreate = vi.fn()

  const { container } = render(<CreateBlogForm createBlog={mockHandleCreate} />)

  const user = userEvent.setup()

  const titleTextBox = container.querySelector('.titleTextBox')
  const authorTextBox = container.querySelector('.authorTextBox')
  const urlTextBox = container.querySelector('.urlTextBox')
  const createButton = screen.getByText('create')

  await user.type(titleTextBox, title)
  await user.type(authorTextBox, author)
  await user.type(urlTextBox, url)
  await user.click(createButton)

  expect(mockHandleCreate.mock.calls).toHaveLength(1)
  expect(mockHandleCreate.mock.calls[0][0].title).toBe(title)
  expect(mockHandleCreate.mock.calls[0][0].author).toBe(author)
  expect(mockHandleCreate.mock.calls[0][0].url).toBe(url)
})