// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import CustomerReport from "./CustomerReport"
import Session from "../../data/Session"

type AllCustomersReportProps = {
  sessions: Session[]
}

const AllCustomersReport: React.FC<AllCustomersReportProps> = ({
  sessions,
}) => {
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [reportData, setReportData] = useState<
    Map<string, Map<string, string[]>>
  >(new Map())

  useEffect(() => {
    if (sessions.length > 0) {
      const newReportData = new Map<string, Map<string, string[]>>()
      const customerNameSet = new Set<string>()

      for (const session of sessions) {
        if (session.schoolName === "Joven Health") continue
        customerNameSet.add(session.schoolName)

        if (!newReportData.has(session.schoolName)) {
          newReportData.set(session.schoolName, new Map<string, string[]>())
        }

        const dataMap = newReportData.get(session.schoolName)!
        const sessionDescription = session.getDescription()

        if (!dataMap.has(sessionDescription)) {
          dataMap.set(sessionDescription, [])
        }
        const history = dataMap.get(sessionDescription)!
        const description = session.generateReportData()
        dataMap.set(sessionDescription, [...history, description])
      }

      setReportData(newReportData)
      setCustomerNames([...customerNameSet].sort())
    } else {
      setReportData(new Map())
      setCustomerNames([])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length])

  return (
    <>
      {customerNames.map((customerName, index) => {
        return (
          <>
            <CustomerReport
              key={index}
              customerName={customerName}
              reportEntries={reportData.get(customerName)!}
            />
          </>
        )
      })}
    </>
  )
}

export default AllCustomersReport
