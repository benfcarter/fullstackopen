import { useParams, useNavigate } from 'react-router-dom'
import { useMutation, useQueryClient } from "@tanstack/react-query"

import { useBlogQuery } from '../queries/blogQuery'
import { useUserQuery } from '../queries/userQuery'

import { useUserValue } from '../contexts/UserContext'
import { useShowNotification } from "../contexts/NotificationContext";

import blogService from "../services/blogs";

const BlogView = () => {
  const queryClient = useQueryClient()
  const blogQuery = useBlogQuery()
  const userQuery = useUserQuery()
  const currentUser = useUserValue()
  const showNotification = useShowNotification()
  const navigate = useNavigate()

  const id = useParams().id

  const likeBlogMutation = useMutation({
    mutationFn: blogService.like,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  const removeBlogMutation = useMutation({
    mutationFn: blogService.remove,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

  if(blogQuery.isLoading || userQuery.isLoading) {
    return <div>loading...</div>
  }

  const blog = blogQuery.data.find(x => x.id === id)
  if(!blog) {
    return <div>blog not found</div>
  }

  const user = userQuery.data.find(x => x.id === blog.user.id)
  if(!user) {
    return <div>user not found</div>
  }

  const shouldShowDelete = currentUser.id === blog.user.id;
  const removeButtonStyle = { display: shouldShowDelete ? "" : "none" };

  const handleLike = (event) => {
    likeBlogMutation.mutate(blog)
  };
  
  const handleRemove = (event) => {
    showNotification(`Removed ${blog.title}`, false);
    removeBlogMutation.mutate(blog)
    navigate('/')
  };

  return (
    <div>
      <h2>{blog.title}</h2>
      <div><a href={blog.url}>{blog.url}</a></div>
      <div>likes {blog.likes}<button onClick={handleLike}>like</button></div>
      <div>added by {user.name}</div>
      <div style={removeButtonStyle}>
        <button onClick={handleRemove}>remove</button>
      </div>
    </div>
  )
}

export default BlogView