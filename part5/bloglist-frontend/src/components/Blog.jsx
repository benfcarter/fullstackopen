import { useState } from 'react'

const Blog = ({ blog }) => {
  const [showDetails, setShowDetails] = useState(false)

  const toggleDetails = () => {
    setShowDetails(!showDetails)
  }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const showDetailsStyle = { display: showDetails ? '' : 'none' }
  const hideDetailsStyle = { display: showDetails ? 'none' : '' }

  const handleLike = (event) => {

  }

  console.log(blog)
  return (
    <div style={blogStyle}>
      {blog.title} {blog.author}
      <button onClick={toggleDetails}>{showDetails ? 'hide' : 'show'}</button>
      <div style={showDetailsStyle}>
        <div>{blog.url}</div>
        <div>{blog.likes}<button onClick={handleLike}>like</button></div>
        <div>{blog.user.name}</div>
      </div>
    </div>  
  )
}

export default Blog