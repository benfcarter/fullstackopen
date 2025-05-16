import { useState, useEffect, useRef, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import CreateBlogForm from "./components/CreateBlogForm";

import { useShowNotification } from "./contexts/NotificationContext";
import UserContext from "./contexts/UserContext";

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  const queryClient = useQueryClient()

  const showNotification = useShowNotification()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll().then((data) => data.sort((a, b) => b.likes - a.likes))
  })

  const blogs = result.data

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

  const handleLogout = () => {
    userDispatch({ type: 'CLEAR_USER' })
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const likeBlog = (blogToLike) => {
    try {
      likeBlogMutation.mutate(blogToLike)
    } catch (exception) {
      showNotification(`Error adding like: ${exception.message}`, true);
    }
  };

  const removeBlog = (blogToRemove) => {
    try {
      removeBlogMutation.mutate(blogToRemove)
      showNotification(`Removed ${blogToRemove.title}`, false);
    } catch (exception) {
      showNotification(`Error removing blog: ${exception.message}`, true);
    }
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET_USER', payload: user })
      blogService.setToken(user.token);
    }
  }, []);

  
  if(result.isLoading) {
    return <div>loading...</div>
  }


  if (user === null) {
    return (
      <div>
        <Notification />
        <h2>log in to application</h2>
        <LoginForm />
      </div>
    );
  }

  return (
    <div>
      <Notification />
      <h2>blogs</h2>
      <p>
        Logged in as {user.username}
        <button onClick={handleLogout}>log out</button>
      </p>
      <CreateBlogForm />
      {blogs.map((blog) => (
        <Blog
          key={blog.id}
          blog={blog}
          userId={user.id}
          likeBlog={likeBlog}
          removeBlog={removeBlog}
        />
      ))}
    </div>
  );
};

export default App;
