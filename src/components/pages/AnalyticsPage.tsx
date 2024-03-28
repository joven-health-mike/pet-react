// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import HorizontalLine from "../widgets/HorizontalLine"
import JovenDataSection from "../data-widgets/JovenDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"
import { SessionsContext } from "../../data/providers/SessionProvider"
import Session from "../../data/Session"
import CustomerFilter from "../data-widgets/CustomerFilter"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import {
  FilteredSessionsContext,
  FilteredSessionsProvider,
} from "../../data/providers/FilteredSessionProvider"

const AnalyticsPage: React.FC = () => {
  const { sessions: allSessions } = useContext(SessionsContext)
  const { filteredSessions, setFilteredSessions } = useContext(
    FilteredSessionsContext
  )
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])

  function* generateFilteredSessions(
    sessions: Session[],
    customerSelections: string
  ) {
    for (const session of sessions) {
      if (customerSelections.includes(session.schoolName)) {
        yield session
      }
    }
  }
  useEffect(() => {
    if (selectedCustomers === undefined || selectedCustomers.join() === "") {
      setFilteredSessions([])
    } else {
      const newFilteredSessions = [
        ...generateFilteredSessions(allSessions, selectedCustomers.join()),
      ]
      setFilteredSessions(newFilteredSessions)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomers])

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
          <FilteredSessionsProvider
            filteredSessions={filteredSessions}
            filter={selectedCustomers}
          >
            <DefaultGrid direction="row">
              <DefaultGridItem>
                <CustomerFilter
                  onCustomerFilterChanged={(data) => setSelectedCustomers(data)}
                />
              </DefaultGridItem>
            </DefaultGrid>
            <JovenDataSection />
            <HorizontalLine />
            <CustomerReportsSection />
            <HorizontalLine />
          </FilteredSessionsProvider>
        </>
      )}
    </>
  )
}

export default AnalyticsPage
