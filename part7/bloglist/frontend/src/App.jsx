import { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes, Route
} from 'react-router-dom'

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogListView from "./components/BlogListView";
import UserListView from "./components/UserListView";
import UserView from "./components/UserView"

import { useBlogQuery } from "./queries/blogQuery";

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
    <Router>
      <Notification />
      <h2>blogs</h2>
      <p>
        Logged in as {user.username}
        <button onClick={handleLogout}>log out</button>
      </p>
      <Routes>
        <Route path="/" element={<BlogListView />} />
        <Route path="/users" element={<UserListView />} />
        <Route path="/users/:id" element={<UserView /> } />
      </Routes>
    </Router>
  );
};

export default App;
