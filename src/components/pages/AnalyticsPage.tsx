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
  const {
    sessions: allSessions,
    customerSessionGroups: allCustomers,
    providerSessionGroups: allProviders,
    typeSessionGroups: allTypes,
  } = useContext(SessionsContext)
  const [filters, setFilters] = useState<Map<string, string[]>>(new Map())
  const [sessionTests, setSessionTests] = useState<
    Map<string, (session: Session) => boolean>
  >(new Map())
  const [filteredSessions, setFilteredSessions] = useState<Session[]>([])
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [customerSelections, setCustomerSelections] = useState<string[]>([])
  const [providerNames, setProviderNames] = useState<string[]>([])
  const [providerSelections, setProviderSelections] = useState<string[]>([])
  const [typeNames, setTypeNames] = useState<string[]>([])
  const [typeSelections, setTypeSelections] = useState<string[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)
  const [typeSessionGroups, setTypeSessionGroups] =
    useState<SessionGroups>(emptySessionGroups)

  useEffect(() => {
    let newSessionGroups = createSessionGroups(allSessions, byCustomer)
    setCustomerSessionGroups(newSessionGroups)
    newSessionGroups = createSessionGroups(allSessions, byProvider)
    setProviderSessionGroups(newSessionGroups)
    newSessionGroups = createSessionGroups(allSessions, byType)
    setTypeSessionGroups(newSessionGroups)
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
    newFiltersMap.set("provider", providerSelections)
    newFiltersMap.set("type", typeSelections)
    setFilters(newFiltersMap)
  }, [customerSelections, providerSelections, typeSelections])

  useEffect(() => {
    const newSessionTests = new Map()
    newSessionTests.set("customer", (session: Session) =>
      customerSelections.includes(session.schoolName)
    )
    newSessionTests.set("provider", (session: Session) =>
      providerSelections.includes(session.providerName)
    )
    newSessionTests.set("type", (session: Session) =>
      typeSelections.includes(session.enhancedServiceName())
    )
    setSessionTests(newSessionTests)
  }, [customerSelections, providerSelections, typeSelections])

  useEffect(() => {
    console.log(`AnalyticsPage.allSessions changed`)
    setCustomerNames([...allCustomers.names()])
    setProviderNames([...allProviders.names()])
    setTypeNames([...allTypes.names()])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [allSessions])

  function* generateFilteredSessions() {
    for (const session of allSessions) {
      if (
        customerSelections.includes(session.schoolName) ||
        providerSelections.includes(session.providerName) ||
        typeSelections.includes(session.enhancedServiceName())
      ) {
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
                        selections={customerSelections}
                        onFilterUpdated={(newFilter) =>
                          setCustomerSelections(newFilter)
                        }
                      />
                    </DefaultGridItem>
                    <DefaultGridItem>
                      <SelectByName
                        label={"Provider"}
                        names={providerNames}
                        selections={providerSelections}
                        onFilterUpdated={(newFilter) =>
                          setProviderSelections(newFilter)
                        }
                      />
                    </DefaultGridItem>
                    <DefaultGridItem>
                      <SelectByName
                        label={"Type"}
                        names={typeNames}
                        selections={typeSelections}
                        onFilterUpdated={(newFilter) =>
                          setTypeSelections(newFilter)
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
