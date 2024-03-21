// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import Session from "../../data/Session"
import SessionGroups from "../../data/SessionGroups"

type CustomerReportsSectionProps = {
  sessions: Session[]
  customerSessionGroups: SessionGroups
}

const CustomerReportsSection: React.FC<CustomerReportsSectionProps> = ({
  sessions,
  customerSessionGroups,
}) => {
  const [customerReportData, setCustomerReportData] = useState<
    Map<string, string[]>
  >(new Map())
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")

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
      <DefaultHeader>Customer Reports</DefaultHeader>
      <DefaultSelectInput
        label="Select a Customer"
        items={[
          ...new Set(sessions.map((session) => session.schoolName).sort()),
        ]}
        enableSelectAll={false}
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
              customerSessionGroups
                .getSessionGroupForName(selectedCustomer)!
                .presences()!
            }
            absences={
              customerSessionGroups
                .getSessionGroupForName(selectedCustomer)!
                .absences()!
            }
          />
        </>
      )}
    </>
  )
}

export default CustomerReportsSection
