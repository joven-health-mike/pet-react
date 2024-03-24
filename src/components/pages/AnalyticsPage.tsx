// Copyright 2022 Social Fabric, LLC

import React, { useContext } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import HorizontalLine from "../widgets/HorizontalLine"
import JovenDataSection from "../data-widgets/JovenDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"
import { SessionsContext } from "../../data/providers/SessionProvider"

const AnalyticsPage: React.FC = () => {
  const { data: sessions } = useContext(SessionsContext)

  return (
    <>
      <Navbar />
      <DefaultHeader>Analytics</DefaultHeader>
      <>
        <ProviderReportUploadWidget />
        <HorizontalLine />
      </>
      {sessions.length > 0 && (
        <>
          <JovenDataSection />
          <HorizontalLine />
          <CustomerReportsSection />
          <HorizontalLine />
        </>
      )}
    </>
  )
}

export default AnalyticsPage
