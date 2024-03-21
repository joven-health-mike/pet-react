// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import Navbar from "../navbar/Navbar"
import DefaultHeader from "../widgets/DefaultHeader"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import Session, { createSession } from "../../data/Session"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"
import HorizontalLine from "../widgets/HorizontalLine"
import SessionGroups, { createSessionGroups } from "../../data/SessionGroups"
import NoShowDataSection from "../data-widgets/NoShowDataSection"
import CustomerReportsSection from "../data-widgets/CustomerReportsSection"

const AnalyticsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>()
  const [readyToDisplay, setReadyToDisplay] = useState<boolean>(false)

  useEffect(() => {
    if (sessions.length > 0) {
      setReadyToDisplay(true)
      setCustomerSessionGroups(
        createSessionGroups(sessions, (session: Session) => session.schoolName)
      )
    } else {
      setReadyToDisplay(false)
      setCustomerSessionGroups(undefined)
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
