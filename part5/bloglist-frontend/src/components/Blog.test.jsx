import { render, screen } from '@testing-library/react'
import Blog from './Blog'

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