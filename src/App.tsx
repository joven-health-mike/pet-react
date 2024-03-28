import React, { useContext } from "react"
import "./App.css"
import AppRouter from "./routes/AppRouter"
import {
  SessionsContext,
  AllSessionsProvider,
} from "./data/providers/SessionProvider"

function App() {
  const { sessions: allSessions } = useContext(SessionsContext)

  return (
    <AllSessionsProvider sessions={allSessions}>
      <div className="App">
        <AppRouter />
      </div>
    </AllSessionsProvider>
  )
}

export default App
