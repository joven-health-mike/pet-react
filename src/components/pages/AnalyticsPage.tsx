// Copyright 2022 Social Fabric, LLC

import React, { useContext } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import NoShowDataSection from "../data-widgets/NoShowDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"
import { SessionsContext } from "../../data/providers/SessionProvider"

const AnalyticsPage: React.FC = () => {
  const { data: sessions } = useContext(SessionsContext)

  return (
    <>
      <Navbar />
      <DefaultHeader>Analytics</DefaultHeader>
      <>
        <ProviderReportUploadWidget
          sessionDataAdapter={adaptTeleTeachersDataForInvoices}
        />
        <HorizontalLine />
      </>
      {sessions.length > 0 && (
        <>
          <NoShowDataSection />
          <HorizontalLine />
          <CustomerReportsSection />
          <HorizontalLine />
        </>
      )}
    </>
  )
}

export default AnalyticsPage
