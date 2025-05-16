import { useEffect, useContext } from "react";
import { useQuery } from "@tanstack/react-query";

import Blog from "./components/Blog";
import blogService from "./services/blogs";
import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import CreateBlogForm from "./components/CreateBlogForm";

import UserContext from "./contexts/UserContext";

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

  const result = useQuery({
    queryKey: ['blogs'],
    queryFn: () => blogService.getAll().then((data) => data.sort((a, b) => b.likes - a.likes))
  })

  const blogs = result.data

  const handleLogout = () => {
    userDispatch({ type: 'CLEAR_USER' })
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem("loggedBlogAppUser");
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      userDispatch({ type: 'SET_USER', payload: user })
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
        />
      ))}
    </div>
  );
};

export default App;
