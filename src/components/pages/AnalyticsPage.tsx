// Copyright 2022 Social Fabric, LLC

import React, { useContext } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import HorizontalLine from "../widgets/HorizontalLine"
import JovenDataSection from "../data-widgets/JovenDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"
import { SessionsContext } from "../../data/providers/SessionProvider"
import CustomerFilter from "../data-widgets/CustomerFilter"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import {
  FilteredSessionsContext,
  FilteredSessionsProvider,
} from "../../data/providers/FilteredSessionProvider"
import ProviderFilter from "../data-widgets/ProviderFilter"
import TypeFilter from "../data-widgets/TypeFilter"
import { FilterProvider } from "../../data/providers/FilterProvider"

const AnalyticsPage: React.FC = () => {
  const { sessions: allSessions } = useContext(SessionsContext)
  const { filteredSessions } = useContext(FilteredSessionsContext)

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
          <FilterProvider>
            <FilteredSessionsProvider filteredSessions={filteredSessions}>
              <DefaultGrid direction="row">
                <DefaultGridItem>
                  <CustomerFilter />
                </DefaultGridItem>
                <DefaultGridItem>
                  <ProviderFilter />
                </DefaultGridItem>
                <DefaultGridItem>
                  <TypeFilter />
                </DefaultGridItem>
              </DefaultGrid>
              <JovenDataSection />
              <HorizontalLine />
              <CustomerReportsSection />
              <HorizontalLine />
            </FilteredSessionsProvider>
          </FilterProvider>
        </>
      )}
    </>
  )
}

export default AnalyticsPage
