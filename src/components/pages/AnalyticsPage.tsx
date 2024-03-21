// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import NoShowDataSection from "../data-widgets/NoShowDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"
import { SessionsContext } from "../../data/providers/SessionProvider"

const AnalyticsPage: React.FC = () => {
  const { data: sessions, customerSessionGroups } = useContext(SessionsContext)
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)

  useEffect(() => {
    if (sessions.length > 0) {
      setReadyToDisplay(true)
    } else {
      setReadyToDisplay(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length])

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
      {readyToDisplay && (
        <>
          <NoShowDataSection sessions={sessions} />
          <HorizontalLine />
          <CustomerReportsSection
            sessions={sessions}
            customerSessionGroups={customerSessionGroups!}
          />
          <HorizontalLine />
        </>
      )}
    </>
  )
}

export default AnalyticsPage
