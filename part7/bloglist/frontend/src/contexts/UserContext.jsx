import { createContext, useReducer, useContext } from "react"
import blogService from "../services/blogs";

const userReducer = (state, action) => {
  switch(action.type) {
    case 'SET_USER':
      blogService.setToken(action.payload.token)
      return action.payload
    case 'CLEAR_USER':
      blogService.setToken(null)
      return null;
    default:
      return state
  }
}

const UserContext = createContext()

export const UserContextProvider = (props) => {
  const [user, userDispatch] = useReducer(userReducer, null)

  return (
    <UserContext.Provider value={[user, userDispatch]}>
      {props.children}
    </UserContext.Provider>
  )
}

export const useUserValue = () => {
  return useContext(UserContext)[0]
}

export const useUserDispatch = () => {
  return useContext(UserContext)[1]
}

export default UserContext