import { useState, useEffect, useContext } from "react"
import {
  createEmptySessionGroups,
  createSessionGroups,
} from "../../data/SessionGroups"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { FilterContext } from "../../data/providers/FilterProvider"

export function useSessionGroupFilter() {
  const { sessions: allSessions } = useContext(SessionsContext)
  const { filter } = useContext(FilterContext)
  const [filteredSessionGroups, setFilteredSessionGroups] = useState(
    createEmptySessionGroups()
  )

  useEffect(() => {
    const newGroups = createSessionGroups(
      allSessions,
      (session) => session.schoolName
    )
    setFilteredSessionGroups(newGroups)
  }, [allSessions, filter])

  return filteredSessionGroups
}
