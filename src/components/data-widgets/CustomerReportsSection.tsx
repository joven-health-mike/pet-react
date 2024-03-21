// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import { SessionsContext } from "../../data/providers/SessionProvider"

const CustomerReportsSection: React.FC = () => {
  const { data: sessions, customerSessionGroups } = useContext(SessionsContext)
  const [customerReportData, setCustomerReportData] = useState<
    Map<string, string[]>
  >(new Map())
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")

  useEffect(() => {
    if (selectedCustomer.length === 0) {
      setCustomerReportData(new Map())
    } else {
      const reportData = new Map<string, string[]>()

      for (const session of customerSessionGroups!.getSessionGroupForName(
        selectedCustomer
      )!.sessions) {
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
      {selectedCustomer !== "" && customerSessionGroups !== undefined && (
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
            noShowsByMonth={
              customerSessionGroups
                .getSessionGroupForName(selectedCustomer)!
                .noShowRatesByMonth()!
            }
          />
        </>
      )}
    </>
  )
}

export default CustomerReportsSection
