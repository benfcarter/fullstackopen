import { createContext, useReducer, useContext } from "react"

const userReducer = (state, action) => {
  switch(action.type) {
    case 'SET_USER':
      return action.payload
    case 'CLEAR_USER':
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