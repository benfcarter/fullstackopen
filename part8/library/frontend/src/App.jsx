import { useState } from "react";
import { useApolloClient } from "@apollo/client";

import Authors from "./components/Authors";
import Books from "./components/Books";
import NewBook from "./components/NewBook";
import Notify from "./components/Notify";
import RecommendedList from "./components/Recommended";
import Login from "./components/Login";

const App = () => {
  const [page, setPage] = useState("authors");
  const [errorMessage, setErrorMessage] = useState(null)
  const [token, setToken] = useState(null)

  const client = useApolloClient()

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 5000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
    setPage("login")
  }

  return (
    <div>
      <div>
        <Notify errorMessage={errorMessage} />
        <button onClick={() => setPage("authors")}>authors</button>
        <button onClick={() => setPage("books")}>books</button>
        {token && <button onClick={() => setPage("add")}>add book</button>}
        {token && <button onClick={() => setPage("recommended")}>recommended</button>}
        {
          token
            ? <button onClick={logout}>logout</button>
            : <button onClick={() => setPage("login")}>login</button>
        }
      </div>

      <Authors show={page === "authors"} setError={notify} />
      <Books show={page === "books"} />
      <NewBook show={page === "add"} />
      <RecommendedList show={page === "recommended"} />
      <Login show={page === "login"} setToken={setToken} setError={notify} />
    </div>
  );
};

export default App;
