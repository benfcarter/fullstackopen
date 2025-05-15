import { useState, useEffect, useRef, useContext } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

import Blog from "./components/Blog";
import blogService from "./services/blogs";
import loginService from "./services/login";
import Togglable from "./components/Togglable";
import Notification from "./components/Notification";
import CreateBlogForm from "./components/CreateBlogForm";

import NotificationContext from "./contexts/NotificationContext";

const App = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);

  const blogFormRef = useRef();

  const showNotification = (message, isError) => {
    notificationDispatch({type: 'SET_NOTIFICATION', payload: {message, isError}})
    setTimeout(() => {
      notificationDispatch({type: 'CLEAR_NOTIFICATION'})
    }, 5000);
  };

  const queryClient = useQueryClient()

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll().then((data) => data.sort((a, b) => b.likes - a.likes))
  })

  const blogs = result.data

  const newBlogMutation = useMutation({
    mutationFn: blogService.create,
    onSuccess: (data) => {
      blogFormRef.current.toggleVisibility();
      showNotification(
        `a new blog ${data.title} by ${data.author} added`,
        false,
      );
      queryClient.invalidateQueries({ queryKey: ['blogs'] })
    }
  })

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

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      setUser(user);
      setUsername("");
      setPassword("");

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));

      blogService.setToken(user.token);
    } catch (exception) {

      showNotification("wrong username or password", true);
    }
  };

  const handleLogout = () => {
    setUser(null);
    blogService.setToken(null);
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  const updateBlogList = (blogs) => {
    //setBlogs(blogs.sort((a, b) => b.likes - a.likes));
  };

  const createBlog = (newBlog) => {
    try {
      newBlogMutation.mutate(newBlog)
    } catch (exception) {
      showNotification(`Error creating blog: ${exception.message}`, true);
    }
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
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  
  if(result.isLoading) {
    return <div>loading...</div>
  }


  if (user === null) {
    return (
      <div>
        <Notification notification={notification} />
        <h2>log in to application</h2>

        <form onSubmit={handleLogin}>
          <div>
            username
            <input
              type="text"
              value={username}
              name="Username"
              onChange={({ target }) => setUsername(target.value)}
            />
          </div>
          <div>
            password
            <input
              type="password"
              value={password}
              name="Password"
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <button type="submit">login</button>
        </form>
      </div>
    );
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
