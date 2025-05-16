import { useContext, useEffect } from 'react'
import NotificationContext from "../contexts/NotificationContext";

const Notification = () => {
  const [notification, notificationDispatch] = useContext(NotificationContext)

  useEffect(() => {
    if(!notification) {
      return
    }

    setTimeout(() => {
      notificationDispatch({ type: 'CLEAR_NOTIFICATION' })
    }, 5000)
  }, [notification])

  if (notification === null) {
    return null;
  }

  const errorStyle = {
    color: "red",
    background: "lightgrey",
    fontSize: "20px",
    borderStyle: "solid",
    borderRadius: "5px",
    padding: "10px",
    marginBottom: "10px",
  };

  const successStyle = { ...errorStyle, color: "green" };

  return (
    <div style={notification.isError ? errorStyle : successStyle}>
      {notification.message}
    </div>
  );
};

export default Notification;
