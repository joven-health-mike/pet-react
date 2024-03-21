import React, { useContext } from "react"
import "./App.css"
import AppRouter from "./routes/AppRouter"
import {
  SessionsContext,
  SessionsProvider,
} from "./data/providers/SessionProvider"

function App() {
  const { data: sessions } = useContext(SessionsContext)

  return (
    <SessionsProvider data={sessions}>
      <div className="App">
        <AppRouter />
      </div>
    </SessionsProvider>
  )
}

export default App
