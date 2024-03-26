// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import { SessionsContext } from "../../data/providers/SessionProvider"

const CustomerReportsSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const [monthlyReportData, setMonthlyReportData] = useState<
    Map<string, string[]>
  >(new Map())
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")

  useEffect(() => {
    if (selectedCustomer.length === 0) {
      setMonthlyReportData(new Map())
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

      setMonthlyReportData(reportData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomer])

  return (
    <>
      {customerSessionGroups && (
        <>
          <DefaultHeader>Customer Reports</DefaultHeader>
          <DefaultSelectInput
            label="Select a Customer"
            items={[...customerSessionGroups.getNames()]}
            enableSelectAll={false}
            onItemSelected={(item) => {
              setSelectedCustomer(item)
            }}
          />
          {selectedCustomer !== "" && (
            <>
              <CustomerReport
                customerName={selectedCustomer}
                reportEntries={monthlyReportData}
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
                noShowsByWeek={
                  customerSessionGroups
                    .getSessionGroupForName(selectedCustomer)!
                    .noShowRatesByWeek()!
                }
              />
            </>
          )}
        </>
      )}
    </>
  )
}

export default CustomerReportsSection
