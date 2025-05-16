import { createContext, useReducer, useContext } from "react"

const notificationReducer = (state, action) => {
  switch(action.type) {
    case 'SET_NOTIFICATION':
      return action.payload
    case 'CLEAR_NOTIFICATION':
      return null;
    default:
      return state
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, null)

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  return useContext(NotificationContext)[0]
}

export const useNotificationDispatch = () => {
  return useContext(NotificationContext)[1]
}

export const useShowNotification = () => {
  const dispatch = useNotificationDispatch()
  return (message, isError, displayTimeInSeconds = 5) => {
    const newNotification = {
      message,
      isError
    }

    dispatch({ type: 'SET_NOTIFICATION', payload: newNotification })
    if(displayTimeInSeconds > 0) {
      setTimeout(() => {
        dispatch({ type: 'CLEAR_NOTIFICATION' })
      }, displayTimeInSeconds * 1000)
    }
  }

}

export default NotificationContext