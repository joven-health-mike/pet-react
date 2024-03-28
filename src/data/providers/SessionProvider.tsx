import React, { ReactNode, useMemo, useState } from "react"
import SessionGroups, {
  createEmptySessionGroups,
  createSessionGroups,
} from "../SessionGroups"
import Session from "../Session"

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
  const byCustomer = (session: Session) => session.schoolName
  const byProvider = (session: Session) => session.providerName
  // TODO: This is very Joven-Specific...
  const byType = (session: Session) => {
    if (
      session.serviceName.includes("Psych") ||
      session.serviceName.includes("SpEd") ||
      session.serviceName.includes("Social Work")
    ) {
      return "Special Education"
    } else if (session.serviceName.includes("Teaching")) {
      return "Teaching"
    } else if (session.serviceName.includes("Mental Health Counseling")) {
      return "Counseling"
    } else if (
      session.serviceName.includes("Speech Therapy") ||
      session.serviceName.includes("Evaluation")
    ) {
      return "Speech"
    }
    return "Indirect Time"
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
