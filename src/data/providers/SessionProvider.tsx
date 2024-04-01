import React, { ReactNode, useMemo, useState } from "react"
import SessionGroups, {
  createEmptySessionGroups,
  createSessionGroups,
} from "../SessionGroups"
import Session from "../Session"
import {
  byCustomer,
  byProvider,
  byType,
} from "../../components/data-widgets/SelectByName"

export type SessionsDataProviderProps = {
  sessions: Session[]
  children?: ReactNode | undefined
}

type SessionsContextData = {
  sessions: Session[]
  customerSessionGroups: SessionGroups
  providerSessionGroups: SessionGroups
  typeSessionGroups: SessionGroups
  setSessions: (input: Session[]) => void
}

const emptySessionGroups = createEmptySessionGroups()

export const SessionsContext = React.createContext<SessionsContextData>({
  sessions: [],
  customerSessionGroups: emptySessionGroups,
  providerSessionGroups: emptySessionGroups,
  typeSessionGroups: emptySessionGroups,
  setSessions: (data: Session[]) => null,
})

export const AllSessionsProvider: React.FC<SessionsDataProviderProps> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [typeSessionGroups, setTypeSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)

  const delegate: SessionsContextData = {
    sessions: sessions,
    customerSessionGroups: customerSessionGroups,
    providerSessionGroups: providerSessionGroups,
    typeSessionGroups: typeSessionGroups,
    setSessions: setSessions,
  }

  useMemo(() => {
    if (sessions.length > 0) {
      setCustomerSessionGroups(createSessionGroups(sessions, byCustomer))
      setProviderSessionGroups(createSessionGroups(sessions, byProvider))
      setTypeSessionGroups(createSessionGroups(sessions, byType))
    } else {
      setCustomerSessionGroups(emptySessionGroups)
      setProviderSessionGroups(emptySessionGroups)
      setTypeSessionGroups(emptySessionGroups)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions])

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
