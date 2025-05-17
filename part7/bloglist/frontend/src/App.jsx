import { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import LoginForm from "./components/LoginForm";
import Notification from "./components/Notification";
import BlogListView from "./components/BlogListView";
import BlogView from "./components/BlogView";
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

  const padding = {
    padding: 5
  }

  return (
    <Router>
      <div>
        <Link data-testid="nav_blogs" style={padding} to="/">blogs</Link>
        <Link data-testid="nav_users" style={padding} to="/users">users</Link>
        {user.name} logged in <button onClick={handleLogout}>logout</button>
      </div>

      <Notification />
      <h2>blog app</h2>

      <Routes>
        <Route path="/" element={<BlogListView />} />
        <Route path="/blogs/:id" element={<BlogView />} />
        <Route path="/users" element={<UserListView />} />
        <Route path="/users/:id" element={<UserView /> } />
      </Routes>
    </Router>
  );
};

export default App;
