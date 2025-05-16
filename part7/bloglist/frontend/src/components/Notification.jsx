import { useContext, useEffect } from 'react'
import { useNotificationValue } from "../contexts/NotificationContext";

const Notification = () => {
  const notification = useNotificationValue()

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
