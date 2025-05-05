import { createContext, useReducer } from 'react'
import { useContext } from 'react'

const notificationReducer = (state, action) => {
  switch(action.type) {
    case "SHOW_NOTIFICATION":
      return {
        content: action.payload.content,
        visible: true
      }
    case "HIDE_NOTIFICATION":
      return {
        content: '',
        visible: false
      }
  }
}

const NotificationContext = createContext()

export const NotificationContextProvider = (props) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, { content: 'Test', visible: false })

  return (
    <NotificationContext.Provider value={[notification, notificationDispatch]}>
      {props.children}
    </NotificationContext.Provider>
  )
}

export const useNotificationValue = () => {
  const contentAndVisibility = useContext(NotificationContext)
  return contentAndVisibility[0]
}

export const useNotificationDispatch = () => {
  const contentAndVisibility = useContext(NotificationContext)
  return contentAndVisibility[1]
}

export default NotificationContext