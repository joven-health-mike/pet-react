// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import Session, { createSession } from "../../data/Session"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import SessionGroups, { createSessionGroups } from "../../data/SessionGroups"
import { sortMapByValue } from "../../utils/SortUtils"
import NoShowDataSection from "../data-widgets/NoShowDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"

const AnalyticsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>()
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>()
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)
  const [customerData, setCustomerData] = useState<Map<string, number>>()
  const [providerData, setProviderData] = useState<Map<string, number>>()

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
    if (sessions.length > 0) {
      setReadyToDisplay(true)
      setCustomerSessionGroups(
        createSessionGroups(sessions, (session: Session) => session.schoolName)
      )
      setProviderSessionGroups(
        createSessionGroups(
          sessions,
          (session: Session) => session.providerName
        )
      )
    } else {
      setReadyToDisplay(false)
      setCustomerData(new Map())
      setProviderData(new Map())
      setCustomerSessionGroups(undefined)
      setProviderSessionGroups(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
          <NoShowDataSection
            customerData={customerData!}
            providerData={providerData!}
          />
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
