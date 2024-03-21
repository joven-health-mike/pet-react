import React, { ReactNode, useEffect, useState } from "react"
import Session from "../Session"
import SessionGroups, { createSessionGroups } from "../SessionGroups"

export type SessionsDataProviderProps = {
  data: Session[]
  children?: ReactNode | undefined
}

type SessionsContextData = {
  data: Session[]
  customerSessionGroups: SessionGroups | undefined
  providerSessionGroups: SessionGroups | undefined
  setData: (input: Session[]) => void
}

export const SessionsContext = React.createContext<SessionsContextData>({
  data: [],
  customerSessionGroups: undefined,
  providerSessionGroups: undefined,
  setData: (data: Session[]) => null,
})

export const SessionsProvider: React.FC<SessionsDataProviderProps> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>()
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>()

  const delegate: SessionsContextData = {
    data: sessions,
    customerSessionGroups: customerSessionGroups,
    providerSessionGroups: providerSessionGroups,
    setData: setSessions,
  }
  const customerFilter = (session: Session) => session.schoolName
  const providerFilter = (session: Session) => session.providerName

  useEffect(() => {
    if (sessions.length > 0) {
      setCustomerSessionGroups(createSessionGroups(sessions, customerFilter))
      setProviderSessionGroups(createSessionGroups(sessions, providerFilter))
    } else {
      setCustomerSessionGroups(undefined)
      setProviderSessionGroups(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length])

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
