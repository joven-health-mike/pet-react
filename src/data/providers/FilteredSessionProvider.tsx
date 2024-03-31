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
import { byCustomer } from "../../components/data-widgets/CustomerFilter"
import { byProvider } from "../../components/data-widgets/ProviderFilter"
import { byType } from "../../components/data-widgets/TypeFilter"
import { FilterContext } from "./FilterProvider"

export type FilteredSessionsDataProviderProps = {
  filteredSessions: Session[]
  children?: ReactNode | undefined
}

type FilteredSessionsContextData = {
  filteredSessions: Session[]
  filteredCustomerSessionGroups: SessionGroups
  filteredProviderSessionGroups: SessionGroups
  filteredTypeSessionGroups: SessionGroups
}

const emptySessionGroups = createEmptySessionGroups()

export const FilteredSessionsContext =
  React.createContext<FilteredSessionsContextData>({
    filteredSessions: [],
    filteredCustomerSessionGroups: emptySessionGroups,
    filteredProviderSessionGroups: emptySessionGroups,
    filteredTypeSessionGroups: emptySessionGroups,
  })

export const FilteredSessionsProvider: React.FC<
  FilteredSessionsDataProviderProps
> = ({ children }) => {
  const { sessions } = useContext(SessionsContext)
  const { filter } = useContext(FilterContext)
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [typeSessionGroups, setTypeSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)

  useEffect(() => {
    const newFilteredSessions = sessions.filter(
      (session) => filter.includes(session.schoolName)
      // filter.includes(session.providerName) ||
      // filter.includes(session.enhancedServiceName())
    )
    setFilteredSessions(newFilteredSessions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter.length, sessions.length])

  const delegate: FilteredSessionsContextData = {
    filteredSessions: filteredSessions,
    filteredCustomerSessionGroups: customerSessionGroups,
    filteredProviderSessionGroups: providerSessionGroups,
    filteredTypeSessionGroups: typeSessionGroups,
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
