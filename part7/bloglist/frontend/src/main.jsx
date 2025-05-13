import ReactDOM from "react-dom/client";
import App from "./App";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import { NotificationContextProvider } from "./contexts/NotificationContext";
import { BlogListContextProvider } from "./contexts/BlogListContext";

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById("root")).render(
  <NotificationContextProvider>
  <BlogListContextProvider>
  <QueryClientProvider client={queryClient}>
    <App />
  </QueryClientProvider>
  </BlogListContextProvider>
  </NotificationContextProvider>
);
