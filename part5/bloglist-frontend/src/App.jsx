import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import Notification from './components/Notification'
import CreateBlogForm from './components/CreateBlogForm'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const blogFormRef = useRef()

  const showNotification = (message, isError) => {
    setNotification({ message, isError })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const handleLogin = async (event) => {
    event.preventDefault()
    
    try {
      const user = await loginService.login({
        username,
        password,
      })

      setUser(user)
      setUsername('')
      setPassword('')

      window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user))

    } catch (exception) {
      showNotification(`wrong username or password`, true)
    }
  }

  const handleLogout = () => {
    setUser(null)
    blogService.setToken(null)
    window.localStorage.removeItem('loggedBlogAppUser')
  }

  const updateBlogList = (blogs) => {
    setBlogs(blogs.sort((a, b) => b.likes - a.likes))
  }

  const createBlog = (newBlog) => {
    try {
      blogService.create(newBlog)
        .then((data) =>{
          console.log(data)
          blogFormRef.current.toggleVisibility()
          updateBlogList(blogs.concat(data))
          showNotification(`a new blog ${data.title} by ${data.author} added`, false)
        })
    } catch(exception) {
      showNotification(`Error creating blog: ${exception.message}`, true)
    }
  }

  const replaceBlog = (updatedBlog) => {
    try {
      blogService.replace(updatedBlog)
        .then((data) => {
          updateBlogList(blogs.map(blog => blog.id === data.id ? data : blog))
        })
    } catch(exception) {
      showNotification(`Error adding like: ${exception.message}`, true)
    } 
  }

  const removeBlog = (blogToRemove) => {
    try {
      blogService.remove(blogToRemove)
      updateBlogList(blogs.filter(blog => blog.id !== blogToRemove.id))
      showNotification(`Removed ${blogToRemove.title}`, false)
    } catch(exception) {
      showNotification(`Error removing blog: ${exception.message}`, true)
    }
  }

  useEffect(() => {
    blogService.getAll().then(blogs => {
      updateBlogList( blogs )
    })  
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  if(user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input type="text" value={username} name="Username" onChange={({ target }) => setUsername(target.value)} />
          </div>
          <div>
            password
            <input type="password" value={password} name="Password" onChange = {({ target }) => setPassword(target.value)} />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    )
  }

  return (
    <div>
      <Notification notification={notification} />
      <h2>blogs</h2>
      <p>
        Logged in as {user.username}
        <button onClick={handleLogout}>log out</button>
      </p>
      <Togglable buttonLabel="new blog" ref={blogFormRef}>
        <h2>create new</h2>
        <CreateBlogForm createBlog={createBlog} />
      </Togglable>
      {blogs.map(blog =>
        <Blog key={blog.id} blog={blog} replaceBlog={replaceBlog} removeBlog={removeBlog} />
      )}
    </div>
  )
}

export default App