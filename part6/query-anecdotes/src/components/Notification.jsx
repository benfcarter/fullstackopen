import { useReducer } from 'react'

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

const Notification = () => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, {content: 'Test', visible: false})

  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  
  if (!notification.visible) return null

  return (
    <div style={style}>
      {notification.content}
    </div>
  )
}

export default Notification
