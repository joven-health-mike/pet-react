// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import NoShowChart from "../data-widgets/NoShowChart"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import Session, { createSession } from "../../data/Session"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "../data-widgets/CustomerReport"
import AllCustomersReport from "../data-widgets/AllCustomersReport"
import SessionGroups, { createSessionGroups } from "../../data/SessionGroups"
import { sortMapByValue } from "../../utils/SortUtils"

const CUSTOMER_CHART_LABEL = "No-Show Rates by Customer"
const PROVIDER_CHART_LABEL = "No-Show Rates by Provider"

const AnalyticsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>()
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>()
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
    if (customerSessionGroups !== undefined) {
      const customerAbsentRates = new Map<string, number>()
      const customerPresences = new Map<string, number>()
      const customerAbsences = new Map<string, number>()
      const customerNames = customerSessionGroups.getNames()
      customerNames.forEach((customerName) => {
        const sessionGroup =
          customerSessionGroups.getSessionGroupForName(customerName)!
        if (sessionGroup.absentRate() > 0) {
          customerAbsentRates.set(
            customerName,
            parseFloat((sessionGroup.absentRate() * 100).toFixed(3))
          )
        }
        customerPresences.set(customerName, sessionGroup.presences())
        customerAbsences.set(customerName, sessionGroup.absences())
      })
      setCustomerData(sortMapByValue(customerAbsentRates))
      setPresences(customerPresences)
      setAbsences(customerAbsences)
    }
  }, [customerSessionGroups])

  useEffect(() => {
    if (providerSessionGroups !== undefined) {
      const providerAbsentRates = new Map<string, number>()
      const providerNames = providerSessionGroups.getNames()
      providerNames.forEach((providerName) => {
        const sessionGroup =
          providerSessionGroups.getSessionGroupForName(providerName)!
        if (sessionGroup.absentRate() > 0) {
          providerAbsentRates.set(
            providerName,
            parseFloat((sessionGroup.absentRate() * 100).toFixed(3))
          )
        }
      })
      setProviderData(sortMapByValue(providerAbsentRates))
    }
  }, [providerSessionGroups])

  useEffect(() => {
    if (readyToDisplay) {
      setCustomerSessionGroups(
        createSessionGroups(sessions, (session: Session) => session.schoolName)
      )
      setProviderSessionGroups(
        createSessionGroups(
          sessions,
          (session: Session) => session.providerName
        )
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [readyToDisplay])

  useEffect(() => {
    if (sessions.length > 0) {
      setReadyToDisplay(true)
    } else {
      setReadyToDisplay(false)
      setCustomerData(new Map())
      setProviderData(new Map())
      setSelectedCustomer("")
      setCustomerSessionGroups(undefined)
      setProviderSessionGroups(undefined)
    }
  }, [sessions.length])

  useEffect(() => {
    if (selectedCustomer.length === 0) {
      setCustomerReportData(new Map())
    } else {
      const reportData = new Map<string, string[]>()

      for (const session of sessions) {
        if (session.schoolName !== selectedCustomer) continue
        const header = session.enhancedServiceName()
        if (!reportData.has(header)) {
          reportData.set(header, [])
        }
        const dataArray = reportData.get(header)!
        dataArray.push(session.toString())
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
                presences={
                  customerSessionGroups!
                    .getSessionGroupForName(selectedCustomer)!
                    .presences()!
                }
                absences={
                  customerSessionGroups!
                    .getSessionGroupForName(selectedCustomer)!
                    .absences()!
                }
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
