import React, { ReactNode, useMemo, useState } from "react"
import Session, {
  sessionFilterGenerator as sessionSkipper,
  skipAllJovenData,
  skipTestData,
} from "../Session"
import SessionGroups, { createSessionGroups } from "../SessionGroups"

export type SessionsDataProviderProps = {
  allSessions: Session[]
  children?: ReactNode | undefined
}

type SessionsContextData = {
  allSessions: Session[]
  filteredSessions: Session[]
  customerSessionGroups: SessionGroups | undefined
  allCustomerSessionGroups: SessionGroups | undefined
  providerSessionGroups: SessionGroups | undefined
  typeSessionGroups: SessionGroups | undefined
  setAllSessions: (input: Session[]) => void
  setFilteredSessions: (sessions: Session[]) => void
}

export const SessionsContext = React.createContext<SessionsContextData>({
  allSessions: [],
  filteredSessions: [],
  customerSessionGroups: undefined,
  allCustomerSessionGroups: undefined,
  providerSessionGroups: undefined,
  typeSessionGroups: undefined,
  setAllSessions: (data: Session[]) => null,
  setFilteredSessions: (sessions: Session[]) => null,
})

export const SessionsProvider: React.FC<SessionsDataProviderProps> = ({
  children,
}) => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>()
  const [allCustomerSessionGroups, setAllCustomerSessionGroups] =
    useState<SessionGroups>()
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>()
  const [typeSessionGroups, setTypeSessionGroups] = useState<SessionGroups>()

  const delegate: SessionsContextData = {
    allSessions: sessions,
    filteredSessions: filteredSessions,
    customerSessionGroups: customerSessionGroups,
    allCustomerSessionGroups: allCustomerSessionGroups,
    providerSessionGroups: providerSessionGroups,
    typeSessionGroups: typeSessionGroups,
    setAllSessions: setSessions,
    setFilteredSessions: setFilteredSessions,
  }
  const customerFilter = (session: Session) => session.schoolName
  const providerFilter = (session: Session) => session.providerName
  const typeFilter = (session: Session) => {
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
    if (filteredSessions.length > 0) {
      setCustomerSessionGroups(
        createSessionGroups(
          filteredSessions,
          customerFilter,
          sessionSkipper(filteredSessions, skipAllJovenData)
        )
      )
      setProviderSessionGroups(
        createSessionGroups(
          filteredSessions,
          providerFilter,
          sessionSkipper(filteredSessions, skipTestData)
        )
      )
      setTypeSessionGroups(
        createSessionGroups(
          filteredSessions,
          typeFilter,
          sessionSkipper(filteredSessions, skipAllJovenData)
        )
      )
    } else {
      setCustomerSessionGroups(undefined)
      setProviderSessionGroups(undefined)
      setTypeSessionGroups(undefined)
    }
  }, [filteredSessions])

  useMemo(() => {
    if (sessions.length > 0) {
      setAllCustomerSessionGroups(
        createSessionGroups(
          sessions,
          customerFilter,
          sessionSkipper(sessions, skipAllJovenData)
        )
      )
    } else {
      setAllCustomerSessionGroups(undefined)
    }
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
