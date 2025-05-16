import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotificationContextProvider } from "./contexts/NotificationContext";
import { UserContextProvider } from "./contexts/UserContext";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
  <UserContextProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  </UserContextProvider>
  </NotificationContextProvider>
);
