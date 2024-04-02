// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import { FilteredSessionsContext } from "../pages/AnalyticsPage"
import SessionGroups, {
  createEmptySessionGroups,
  createSessionGroups,
} from "../../data/SessionGroups"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { byProvider } from "./SelectByName"
import ProviderReport from "./ProviderReport"

const ProviderReportsSection: React.FC = () => {
  const { sessions: allSessions } = useContext(SessionsContext)
  const filteredSessions = useContext(FilteredSessionsContext)
  const [selectedProvider, setSelectedProvider] = useState<string>("")
  const [providerNames, setProviderNames] = useState<string[]>([])
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>(createEmptySessionGroups())

  useEffect(() => {
    const newCustomerSessionGroups = createSessionGroups(
      allSessions,
      byProvider
    )
    setProviderSessionGroups(newCustomerSessionGroups)
  }, [allSessions])

  useEffect(() => {
    const newCustomerSessionGroups = createSessionGroups(
      filteredSessions,
      byProvider
    )
    setProviderSessionGroups(newCustomerSessionGroups)
  }, [filteredSessions])

  useEffect(() => {
    const newProviderNames = [...providerSessionGroups.names()]
    if (newProviderNames.length === 0) {
      setSelectedProvider("")
      setProviderNames([])
      return
    }
    if (selectedProvider === undefined) {
      setSelectedProvider(newProviderNames[0])
    } else if (
      selectedProvider.length > 0 &&
      !newProviderNames.join().includes(selectedProvider)
    ) {
      setSelectedProvider(newProviderNames[0])
    }
    setProviderNames(newProviderNames)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerSessionGroups])

  return (
    <>
      <>
        {providerSessionGroups && (
          <>
            <DefaultHeader>Provider Reports</DefaultHeader>
            <DefaultSelectInput
              label="Select a Provider"
              items={providerNames}
              enableSelectAll={false}
              onItemSelected={(item) => {
                setSelectedProvider(item)
              }}
            />
            {providerNames.length > 0 && selectedProvider !== "" && (
              <>
                <ProviderNameContext.Provider value={selectedProvider}>
                  <ProviderReport />
                </ProviderNameContext.Provider>
              </>
            )}
          </>
        )}
      </>
    </>
  )
}

export const ProviderNameContext = React.createContext<string>("")

export default ProviderReportsSection
