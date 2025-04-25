import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import CreateBlogForm from './CreateBlogForm'

test('renders content', () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'google',
    likes: 1000,
    user: {
      name: 'Me'
    }
  }

  const { container } = render(<Blog blog={blog} replaceBlog={blog => {}} removeBlog={blog => {}} />)

  const titleAndAuthor = container.querySelector('.titleAuthor')
  const details = container.querySelector('.details')
  expect(titleAndAuthor).toBeDefined()
  expect(details).toHaveStyle('display: none')

})

test('details render when show button clicked', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'google',
    likes: 1000,
    user: {
      name: 'Me'
    }
  }

  const { container } = render(<Blog blog={blog} replaceBlog={blog => {}} removeBlog={blog => {}} />)

  const user = userEvent.setup()
  const showButton = container.querySelector('.showButton')
  await user.click(showButton)

  const titleAndAuthor = container.querySelector('.titleAuthor')
  const details = container.querySelector('.details')
  expect(titleAndAuthor).toBeDefined()
  expect(details).not.toHaveStyle('display: none')

})

test('like button triggers function', async () => {
  const blog = {
    title: 'Test Title',
    author: 'Test Author',
    url: 'google',
    likes: 1000,
    user: {
      name: 'Me'
    }
  }

  const mockReplaceBlog = vi.fn()

  const { container } = render(<Blog blog={blog} replaceBlog={mockReplaceBlog} removeBlog={blog => {}} />)

  const user = userEvent.setup()
  const showButton = container.querySelector('.showButton')
  await user.click(showButton)

  const likeButton = container.querySelector('.likeButton')

  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockReplaceBlog.mock.calls).toHaveLength(2)
})

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