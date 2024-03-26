// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSubHeader from "../widgets/DefaultSubHeader"
import { Box } from "@mui/material"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import NoShowPieChart from "./charts/NoShowPieChart"
import { formatPercent } from "../../utils/MathUtils"
import NoShowLineChart from "./charts/NoShowLineChart"
import DefaultText from "../widgets/DefaultText"
import { SessionsContext } from "../../data/providers/SessionProvider"
import DefaultAccordionGroup from "../widgets/DefaultAccordionGroup"
import { CustomerNameContext } from "./CustomerReportsSection"

const CustomerReport: React.FC = () => {
  const customerName = useContext(CustomerNameContext)
  return (
    <>
      <Box
        flexDirection={"column"}
        justifyContent="center"
        display="flex"
        sx={{ p: 2 }}
      >
        <DefaultHeader props={{ mt: 0 }}>{customerName}</DefaultHeader>

        <DefaultAccordionGroup
          labels={[
            "Session List",
            "Absence Metrics",
            "No-Show Rates by Month",
            "No-Show Rates by Week",
          ]}
          nodes={[
            <SessionListSection />,
            <AbsencesMetricsSection />,
            <NoShowRatesByMonthSection />,
            <NoShowRatesByWeekSection />,
          ]}
          defaultExpanded={[false, true, true, true]}
        />

        <Box sx={{ mb: 2 }}></Box>
      </Box>
    </>
  )
}

const SessionListSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const customerName = useContext(CustomerNameContext)
  const [monthlyReportData, setMonthlyReportData] = useState<
    Map<string, string[]>
  >(new Map())

  useEffect(() => {
    if (customerName.length === 0) {
      setMonthlyReportData(new Map())
    } else {
      const reportData = new Map<string, string[]>()

      for (const session of customerSessionGroups!.getSessionGroupForName(
        customerName
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
  }, [customerName])

  return (
    <>
      {Array.from(monthlyReportData.entries()).map((entry, entryIndex) => {
        const sectionHeader = entry[0]
        const sectionItems = entry[1]

        return (
          <>
            <DefaultSubHeader props={{ mt: 0 }} key={entryIndex}>
              {sectionHeader}
            </DefaultSubHeader>
            {sectionItems.map((itemEntry, itemIndex) => {
              return <DefaultText key={itemIndex}>{itemEntry}</DefaultText>
            })}
          </>
        )
      })}
    </>
  )
}

const AbsencesMetricsSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const customerName = useContext(CustomerNameContext)
  const [presences, setPresences] = useState<number>(0)
  const [absences, setAbsences] = useState<number>(0)

  useEffect(() => {
    if (!customerSessionGroups) return
    setPresences(
      customerSessionGroups!.getSessionGroupForName(customerName)!.presences()!
    )
    setAbsences(
      customerSessionGroups!.getSessionGroupForName(customerName)!.absences()!
    )
  }, [customerSessionGroups, customerName])

  return (
    <DefaultGrid direction="row">
      <DefaultGridItem>
        <NoShowPieChart
          chartTitle={"Overall No-Show Rate"}
          presences={presences}
          absences={absences}
        />
      </DefaultGridItem>
      <DefaultGridItem>
        <DefaultHeader>
          Total No-Show Rate:{" "}
          {formatPercent(
            presences + absences === 0 ? 0 : absences / (presences + absences)
          )}
        </DefaultHeader>
      </DefaultGridItem>
    </DefaultGrid>
  )
}

const NoShowRatesByMonthSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const customerName = useContext(CustomerNameContext)
  return (
    <DefaultGrid direction="row">
      <DefaultGridItem>
        <NoShowLineChart
          chartTitle="No-Show Rate by Month"
          data={
            customerSessionGroups!
              .getSessionGroupForName(customerName)!
              .noShowRatesByMonth()!
          }
        />
      </DefaultGridItem>
    </DefaultGrid>
  )
}

const NoShowRatesByWeekSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const customerName = useContext(CustomerNameContext)
  return (
    <DefaultGrid direction="row">
      <DefaultGridItem>
        <NoShowLineChart
          chartTitle="No-Show Rate by Week"
          data={
            customerSessionGroups!
              .getSessionGroupForName(customerName)!
              .noShowRatesByWeek()!!
          }
        />
      </DefaultGridItem>
    </DefaultGrid>
  )
}

export default CustomerReport
