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
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "../data-widgets/CustomerReport"
import AllCustomersReport from "../data-widgets/AllCustomersReport"

const CUSTOMER_CHART_LABEL = "No-Show Rates by Customer"
const PROVIDER_CHART_LABEL = "No-Show Rates by Provider"

const AnalyticsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)
  const [customerData, setCustomerData] = useState<Map<string, number>>()
  const [providerData, setProviderData] = useState<Map<string, number>>()
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [customerReportData, setCustomerReportData] = useState<
    Map<string, string[]>
  >(new Map())
  const [presences, setPresences] = useState<Map<string, number>>(new Map())
  const [absences, setAbsences] = useState<Map<string, number>>(new Map())

  useEffect(() => {
    const noShowRateCalculator = new NoShowRateCalculator(sessions)
    let unsortedMap = noShowRateCalculator.calculate(customerFilter)
    let sortedArray = [...unsortedMap].sort((a, b) => b[1] - a[1])
    let sortedMap = new Map(sortedArray)
    setCustomerData(sortedMap)

    unsortedMap = noShowRateCalculator.calculate(providerFilter)
    sortedArray = [...unsortedMap].sort((a, b) => b[1] - a[1])
    sortedMap = new Map(sortedArray)
    setProviderData(sortedMap)

    const noShowMap: Map<string, number[]> =
      noShowRateCalculator.calculateNoShowRates()

    const presencesMap: Map<string, number> = new Map()
    const absencesMap: Map<string, number> = new Map()

    for (const customer of noShowMap.keys()) {
      presencesMap.set(customer, noShowMap.get(customer)![0])
      absencesMap.set(customer, noShowMap.get(customer)![1])
    }

    setPresences(presencesMap)
    setAbsences(absencesMap)

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToDisplay])

  useEffect(() => {
    if (sessions.length > 0) {
      setReadyToDisplay(true)
    } else {
      setReadyToDisplay(false)
    }
  }, [sessions.length])

  useEffect(() => {
    if (selectedCustomer.length === 0) {
      setCustomerReportData(new Map())
    } else {
      const reportData = new Map<string, string[]>()

      for (const session of sessions) {
        if (session.schoolName !== selectedCustomer) continue
        const header = session.getDescription()
        if (!reportData.has(header)) {
          reportData.set(header, [])
        }
        const dataArray = reportData.get(header)!
        dataArray.push(session.generateReportData())
      }

      setCustomerReportData(reportData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer])

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
          <DefaultHeader>Customer Reports</DefaultHeader>
          <DefaultSelectInput
            label="Select a Customer"
            items={[
              ...new Set(sessions.map((session) => session.schoolName).sort()),
            ]}
            onAllSelected={() => {
              setSelectedCustomer("")
            }}
            onItemSelected={(item) => {
              setSelectedCustomer(item)
            }}
          />
          {selectedCustomer !== "" && (
            <>
              <CustomerReport
                customerName={selectedCustomer}
                reportEntries={customerReportData}
                presences={presences.get(selectedCustomer)!}
                absences={absences.get(selectedCustomer)!}
              />
            </>
          )}
          {selectedCustomer === "" && (
            <AllCustomersReport
              sessions={sessions}
              presences={presences}
              absences={absences}
            />
          )}
        </>
      )}
    </>
  )
}

export default AnalyticsPage
