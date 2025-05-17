import { Link } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  Button,
} from '@mui/material'

import { useUserDispatch, useUserValue } from '../contexts/UserContext'

const NavigationBar = () => {
  const user = useUserValue()
  const userDispatch = useUserDispatch()

  const handleLogout = () => {
    userDispatch({ type: 'CLEAR_USER' })
    window.localStorage.removeItem("loggedBlogAppUser");
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Button color="inherit" component={Link} data-testid="nav_blogs" to="/">
          blogs
        </Button>
        <Button color="inherit" component={Link} to="/users" data-testid="nav_users">
          users
        </Button>
        {user
          ? <div><em>{user.name} logged in</em> <button onClick={handleLogout}>logout</button></div>
          : null}
      </Toolbar>
    </AppBar>
  )
}

export default NavigationBar