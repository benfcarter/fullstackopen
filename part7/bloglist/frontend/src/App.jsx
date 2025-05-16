import { useEffect, useContext } from "react";

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import CreateBlogForm from "./components/CreateBlogForm";
import { useBlogQuery } from "./queries/blogQuery";
import BlogList from "./components/BlogList"

import UserContext from "./contexts/UserContext";

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

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

  const result = useBlogQuery()
  
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
      <BlogList />
    </div>
  );
};

export default App;
