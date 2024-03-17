// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import NoShowChart from "../data-widgets/NoShowChart"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import Session, { createSession } from "../../data/Session"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import NoShowRateCalculator from "../../utils/NoShowRateCalculator"

const AnalyticsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)
  const [customerData, setCustomerData] = useState<Map<string, number>>()

  useEffect(() => {
    const unsortedMap = new NoShowRateCalculator(sessions).calculate()
    const sortedArray = [...unsortedMap].sort((a, b) => b[1] - a[1])
    const sortedMap = new Map(sortedArray)
    setCustomerData(sortedMap)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToDisplay])

  useEffect(() => {
    if (sessions.length > 0) {
      setReadyToDisplay(true)
    } else {
      setReadyToDisplay(false)
    }
  }, [sessions.length])

  return (
    <>
      <Navbar />
      <DefaultHeader>Analytics</DefaultHeader>
      <>
        <ProviderReportUploadWidget
          onSessionsLoaded={(sessions: Session[]) => {
            setSessions(sessions)
          }}
          onSessionsCleared={() => {
            setSessions([])
          }}
          sessionFactory={createSession}
          sessionDataAdapter={adaptTeleTeachersDataForInvoices}
        />
        <HorizontalLine />
      </>
      {readyToDisplay && <NoShowChart customerData={customerData!} />}
    </>
  )
}

export default AnalyticsPage
