// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import HorizontalLine from "../widgets/HorizontalLine"
import JovenDataSection from "../data-widgets/JovenDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"
import { SessionsContext } from "../../data/providers/SessionProvider"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import SelectByName, {
  byCustomer,
  byProvider,
  byType,
} from "../data-widgets/SelectByName"
import Session from "../../data/Session"
import SessionGroups, {
  createEmptySessionGroups,
  createSessionGroups,
} from "../../data/SessionGroups"

const emptySessionGroups = createEmptySessionGroups()

const AnalyticsPage: React.FC = () => {
  const { sessions: allSessions, customerSessionGroups: allCustomers } =
    useContext(SessionsContext)
  const [filters, setFilters] = useState<Map<string, string[]>>(new Map())
  const [sessionTests, setSessionTests] = useState<
    Map<string, (session: Session) => boolean>
  >(new Map())
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [customerSelections, setCustomerSelections] = useState<string[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [typeSessionGroups, setTypeSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)

  useEffect(() => {
    const newCustomerSessionGroups = createSessionGroups(
      allSessions,
      byCustomer
    )
    setCustomerSessionGroups(newCustomerSessionGroups)
    const newProviderSessionGroups = createSessionGroups(
      allSessions,
      byProvider
    )
    setProviderSessionGroups(newProviderSessionGroups)
    const newTypeSessionGroups = createSessionGroups(allSessions, byType)
    setTypeSessionGroups(newTypeSessionGroups)

    setCustomerSelections([...newCustomerSessionGroups.names()])
  }, [allSessions])

  useEffect(() => {
    let newSessionGroups = createSessionGroups(filteredSessions, byCustomer)
    setCustomerSessionGroups(newSessionGroups)
    newSessionGroups = createSessionGroups(filteredSessions, byProvider)
    setProviderSessionGroups(newSessionGroups)
    newSessionGroups = createSessionGroups(filteredSessions, byType)
    setTypeSessionGroups(newSessionGroups)
  }, [filteredSessions])

  useEffect(() => {
    const newFilteredSessions = [...generateFilteredSessions()]
    setFilteredSessions(newFilteredSessions)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filters, sessionTests])

  useEffect(() => {
    const newFiltersMap = new Map()
    newFiltersMap.set("customer", customerSelections)
    setFilters(newFiltersMap)
  }, [customerSelections])

  useEffect(() => {
    const newSessionTests = new Map()
    newSessionTests.set("customer", (session: Session) =>
      customerSelections.includes(session.schoolName)
    )
    setSessionTests(newSessionTests)
  }, [customerSelections])

  useEffect(() => {
    setCustomerNames([...allCustomers.names()])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSessions])

  function* generateFilteredSessions() {
    for (const session of allSessions) {
      if (customerSelections.includes(session.schoolName)) {
        yield session
      }
    }
  }

  return (
    <>
      <Navbar />
      <DefaultHeader>Analytics</DefaultHeader>
      <>
        <ProviderReportUploadWidget />
        <HorizontalLine />
      </>
      {allSessions.length > 0 && (
        <>
          <FilteredSessionsContext.Provider value={filteredSessions}>
            <CustomerSessionGroupsContext.Provider
              value={customerSessionGroups}
            >
              <ProviderSessionGroupsContext.Provider
                value={providerSessionGroups}
              >
                <TypeSessionGroupsContext.Provider value={typeSessionGroups}>
                  <DefaultGrid direction="row">
                    <DefaultGridItem>
                      <SelectByName
                        label={"Customer"}
                        names={customerNames}
                        defaultSelectAll
                        onFilterUpdated={(newFilter) =>
                          setCustomerSelections(newFilter)
                        }
                      />
                    </DefaultGridItem>
                  </DefaultGrid>
                  <JovenDataSection />
                  <HorizontalLine />
                  <CustomerReportsSection />
                  <HorizontalLine />
                </TypeSessionGroupsContext.Provider>
              </ProviderSessionGroupsContext.Provider>
            </CustomerSessionGroupsContext.Provider>
          </FilteredSessionsContext.Provider>
        </>
      )}
    </>
  )
}

export const FilteredSessionsContext = React.createContext<Session[]>([])
export const CustomerSessionGroupsContext =
  React.createContext<SessionGroups>(emptySessionGroups)
export const ProviderSessionGroupsContext =
  React.createContext<SessionGroups>(emptySessionGroups)
export const TypeSessionGroupsContext =
  React.createContext<SessionGroups>(emptySessionGroups)

export default AnalyticsPage
