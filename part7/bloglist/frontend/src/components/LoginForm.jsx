import { useState } from 'react'
import {
  TextField,
  Button,
} from '@mui/material'

import { useShowNotification } from "../contexts/NotificationContext";
import { useUserDispatch } from "../contexts/UserContext";

import blogService from "../services/blogs";
import loginService from "../services/login";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const showNotification = useShowNotification()
  const userDispatch = useUserDispatch()

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const user = await loginService.login({
        username,
        password,
      });

      userDispatch({ type: 'SET_USER', payload: user })
      setUsername("");
      setPassword("");

      window.localStorage.setItem("loggedBlogAppUser", JSON.stringify(user));

      blogService.setToken(user.token);
    } catch (exception) {
      showNotification("wrong username or password", true);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <TextField label="username"
          value={username}
          name="Username"
          onChange={({ target }) => setUsername(target.value)}
        />
      </div>
      <div>
        <TextField label="password"
          type="password"
          value={password}
          name="Password"
          onChange={({ target }) => setPassword(target.value)}
        />
      </div>
      <Button variant="contained" type="submit">login</Button>
    </form>
  );
};

export default LoginForm;
