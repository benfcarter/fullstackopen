import { useEffect, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes, Route, Link
} from 'react-router-dom'

import { Container } from '@mui/material'

import LoginForm from "./components/LoginForm";
import NavigationBar from "./components/NavigationBar";
import Notification from "./components/Notification";
import BlogListView from "./components/BlogListView";
import BlogView from "./components/BlogView";
import UserListView from "./components/UserListView";
import UserView from "./components/UserView"

import { useBlogQuery } from "./queries/blogQuery";

import UserContext from "./contexts/UserContext";

const App = () => {
  const [user, userDispatch] = useContext(UserContext)

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
      <Container>
        <div>
          <Notification />
          <h2>log in to application</h2>
          <LoginForm />
        </div>
      </Container>
    );
  }

  const padding = {
    padding: 5
  }

  return (
    <Container>
      <Router>
        <Notification />
        <NavigationBar />
        <h2>Blog App (for fullstackopen)</h2>
        <Routes>
          <Route path="/" element={<BlogListView />} />
          <Route path="/blogs/:id" element={<BlogView />} />
          <Route path="/users" element={<UserListView />} />
          <Route path="/users/:id" element={<UserView /> } />
        </Routes>
      </Router>
    </Container>
  );
};

export default App;
