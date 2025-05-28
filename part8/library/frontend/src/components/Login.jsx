import { useState, useEffect } from 'react'
import { useMutation } from '@apollo/client'
import { LOGIN } from '../queries/mutations'

const Login = ({ show, setError, setToken }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const [login, result] = useMutation(LOGIN, {
    onError: (error) => {
      setError(error.graphQLErrors[0].message)

      setUsername('')
      setPassword('')
    }
  })

  useEffect(() => {
    if(result.data) {
      const token = result.data.login.value
      setToken(token)
      localStorage.setItem('library-user-token', token)

      setUsername('')
      setPassword('')
    }
  }, [result.data])

  if(!show) {
    return null
  }

  const handleLogin = (event) => {
    event.preventDefault()
    login({ variables: { username, password }})
  }

  return (
    <div>
      <form onSubmit={handleLogin}>
        <div>username <input value={username} onChange={({ target }) => setUsername(target.value)} /></div>
        <div>password <input value={password} onChange={({ target }) => setPassword(target.value)} type="password" /></div>
        <div><button type="submit">login</button></div>
      </form>
    </div>
  )
}

export default Login