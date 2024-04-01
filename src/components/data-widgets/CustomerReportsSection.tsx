// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import { FilteredSessionsContext } from "../pages/AnalyticsPage"
import SessionGroups, {
  createEmptySessionGroups,
  createSessionGroups,
} from "../../data/SessionGroups"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { byCustomer } from "./SelectByName"

const CustomerReportsSection: React.FC = () => {
  const { sessions: allSessions } = useContext(SessionsContext)
  const filteredSessions = useContext(FilteredSessionsContext)
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>(createEmptySessionGroups())

  useEffect(() => {
    const newCustomerSessionGroups = createSessionGroups(
      allSessions,
      byCustomer
    )
    setCustomerSessionGroups(newCustomerSessionGroups)
  }, [allSessions])

  useEffect(() => {
    const newCustomerSessionGroups = createSessionGroups(
      filteredSessions,
      byCustomer
    )
    setCustomerSessionGroups(newCustomerSessionGroups)
  }, [filteredSessions])

  useEffect(() => {
    const newCustomerNames = [...customerSessionGroups.names()]
    if (newCustomerNames.length === 0) {
      setSelectedCustomer("")
      setCustomerNames([])
      return
    }
    if (selectedCustomer === undefined) {
      setSelectedCustomer(newCustomerNames[0])
    } else if (
      selectedCustomer.length > 0 &&
      !newCustomerNames.join().includes(selectedCustomer)
    ) {
      setSelectedCustomer(newCustomerNames[0])
    }
    setCustomerNames(newCustomerNames)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSessionGroups])

  return (
    <>
      <>
        {customerSessionGroups && (
          <>
            <DefaultHeader>Customer Reports</DefaultHeader>
            <DefaultSelectInput
              label="Select a Customer"
              items={customerNames}
              enableSelectAll={false}
              onItemSelected={(item) => {
                setSelectedCustomer(item)
              }}
            />
            {customerNames.length > 0 && selectedCustomer !== "" && (
              <>
                <CustomerNameContext.Provider value={selectedCustomer}>
                  <CustomerReport />
                </CustomerNameContext.Provider>
              </>
            )}
          </>
        )}
      </>
    </>
  )
}

export const CustomerNameContext = React.createContext<string>("")

export default CustomerReportsSection
