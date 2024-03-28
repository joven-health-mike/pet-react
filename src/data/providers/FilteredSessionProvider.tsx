import React, {
  ReactNode,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react"
import SessionGroups, {
  createEmptySessionGroups,
  createSessionGroups,
} from "../SessionGroups"
import Session from "../Session"
import { SessionsContext } from "./SessionProvider"

export type FilteredSessionsDataProviderProps = {
  filteredSessions: Session[]
  filter: string[]
  children?: ReactNode | undefined
}

type FilteredSessionsContextData = {
  filteredSessions: Session[]
  filteredCustomerSessionGroups: SessionGroups
  filteredProviderSessionGroups: SessionGroups
  filteredTypeSessionGroups: SessionGroups
  setFilteredSessions: (input: Session[]) => void
}

const emptySessionGroups = createEmptySessionGroups()

export const FilteredSessionsContext =
  React.createContext<FilteredSessionsContextData>({
    filteredSessions: [],
    filteredCustomerSessionGroups: emptySessionGroups,
    filteredProviderSessionGroups: emptySessionGroups,
    filteredTypeSessionGroups: emptySessionGroups,
    setFilteredSessions: (data: Session[]) => null,
  })

export const FilteredSessionsProvider: React.FC<
  FilteredSessionsDataProviderProps
> = ({ filter, children }) => {
  const { sessions } = useContext(SessionsContext)
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [typeSessionGroups, setTypeSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)

  const delegate: FilteredSessionsContextData = {
    filteredSessions: filteredSessions,
    filteredCustomerSessionGroups: customerSessionGroups,
    filteredProviderSessionGroups: providerSessionGroups,
    filteredTypeSessionGroups: typeSessionGroups,
    setFilteredSessions: setFilteredSessions,
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
    if (filteredSessions.length > 0) {
      setCustomerSessionGroups(
        createSessionGroups(filteredSessions, byCustomer)
      )
      setProviderSessionGroups(
        createSessionGroups(filteredSessions, byProvider)
      )
      setTypeSessionGroups(createSessionGroups(filteredSessions, byType))
    } else {
      setCustomerSessionGroups(emptySessionGroups)
      setProviderSessionGroups(emptySessionGroups)
      setTypeSessionGroups(emptySessionGroups)
    }
  }, [filteredSessions])

  useEffect(() => {
    if (sessions.length > 0) {
      setFilteredSessions(sessions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length])

  useEffect(() => {
    const newFilteredSessions = []
    for (const session of sessions) {
      if (filter.join().includes(session.schoolName)) {
        newFilteredSessions.push(session)
      }
    }
    setFilteredSessions(newFilteredSessions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.length])

  return (
    <FilteredSessionsContext.Provider
      value={{
        ...delegate,
      }}
    >
      {children}
    </FilteredSessionsContext.Provider>
  )
}
