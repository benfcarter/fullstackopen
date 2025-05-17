import {
  Alert,
} from '@mui/material'

import { useNotificationValue } from "../contexts/NotificationContext";

const Notification = () => {
  const notification = useNotificationValue()

  if (notification === null) {
    return null;
  }

  return (
    <Alert severity={notification.isError ? "error" : "success"}>
      {notification.message}
    </Alert>
  );
};

export default Notification;
