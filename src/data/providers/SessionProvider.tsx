import React, { ReactNode, useMemo, useState } from "react"
import Session, {
  sessionFilterGenerator as sessionSkipper,
  skipAllJovenData,
  skipTestData,
} from "../Session"
import SessionGroups, { createSessionGroups } from "../SessionGroups"

export type SessionsDataProviderProps = {
  data: Session[]
  children?: ReactNode | undefined
}

type SessionsContextData = {
  data: Session[]
  customerSessionGroups: SessionGroups | undefined
  providerSessionGroups: SessionGroups | undefined
  typeSessionGroups: SessionGroups | undefined
  setData: (input: Session[]) => void
}

export const SessionsContext = React.createContext<SessionsContextData>({
  data: [],
  customerSessionGroups: undefined,
  providerSessionGroups: undefined,
  typeSessionGroups: undefined,
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
  const [typeSessionGroups, setTypeSessionGroups] = useState<SessionGroups>()

  const delegate: SessionsContextData = {
    data: sessions,
    customerSessionGroups: customerSessionGroups,
    providerSessionGroups: providerSessionGroups,
    typeSessionGroups: typeSessionGroups,
    setData: setSessions,
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
    if (sessions.length > 0) {
      setCustomerSessionGroups(
        createSessionGroups(
          sessions,
          customerFilter,
          sessionSkipper(sessions, skipAllJovenData)
        )
      )
      setProviderSessionGroups(
        createSessionGroups(
          sessions,
          providerFilter,
          sessionSkipper(sessions, skipTestData)
        )
      )
      setTypeSessionGroups(
        createSessionGroups(
          sessions,
          typeFilter,
          sessionSkipper(sessions, skipAllJovenData)
        )
      )
    } else {
      setCustomerSessionGroups(undefined)
      setProviderSessionGroups(undefined)
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
