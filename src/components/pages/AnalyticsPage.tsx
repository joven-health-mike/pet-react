// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import NoShowChart from "../data-widgets/NoShowChart"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import Session, { createSession } from "../../data/Session"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import NoShowRateCalculator, {
  customerFilter,
  providerFilter,
} from "../../utils/NoShowRateCalculator"
import AllCustomersReport from "../data-widgets/AllCustomersReport"

const CUSTOMER_CHART_LABEL = "No-Show Rates by Customer"
const PROVIDER_CHART_LABEL = "No-Show Rates by Provider"

const AnalyticsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)
  const [customerData, setCustomerData] = useState<Map<string, number>>()
  const [providerData, setProviderData] = useState<Map<string, number>>()

  useEffect(() => {
    let unsortedMap = new NoShowRateCalculator(sessions).calculate(
      customerFilter
    )
    let sortedArray = [...unsortedMap].sort((a, b) => b[1] - a[1])
    let sortedMap = new Map(sortedArray)
    setCustomerData(sortedMap)

    unsortedMap = new NoShowRateCalculator(sessions).calculate(providerFilter)
    sortedArray = [...unsortedMap].sort((a, b) => b[1] - a[1])
    sortedMap = new Map(sortedArray)
    setProviderData(sortedMap)
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
      {readyToDisplay && (
        <>
          <NoShowChart chartTitle={CUSTOMER_CHART_LABEL} data={customerData!} />
          <NoShowChart chartTitle={PROVIDER_CHART_LABEL} data={providerData!} />
          <HorizontalLine />
          <AllCustomersReport sessions={sessions} />
        </>
      )}
    </>
  )
}

export default AnalyticsPage
