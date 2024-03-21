import React, { useState } from "react"
import { ContextData, DataProviderProps } from "./DataProviderProps"
import Session from "../Session"

export const SessionsContext = React.createContext<ContextData<Session>>({
  data: [],
  setData: (data: Session[]) => null,
})

export const SessionsProvider: React.FC<DataProviderProps<Session[]>> = ({
  children,
}) => {
  const [schools, setSchools] = useState<Session[]>([])
  const delegate: ContextData<Session> = {
    data: schools,
    setData: setSchools,
  }
  return (
    <SessionsContext.Provider
      value={{
        ...delegate,
      }}
    >
      {children}
    </SessionsContext.Provider>
  )
}
