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
import DefaultAccordion from "../widgets/DefaultAccordion"
import DefaultText from "../widgets/DefaultText"
import { SessionsContext } from "../../data/providers/SessionProvider"

type CustomerReportProps = {
  customerName: string
}

const CustomerReport: React.FC<CustomerReportProps> = ({ customerName }) => {
  return (
    <>
      <Box
        flexDirection={"column"}
        justifyContent="center"
        display="flex"
        sx={{ p: 2 }}
      >
        <DefaultHeader props={{ mt: 0 }}>{customerName}</DefaultHeader>
        <DefaultAccordion label="Session List">
          <SessionListSection customerName={customerName} />
        </DefaultAccordion>
        <DefaultAccordion label="Absence Metrics" defaultExpanded={true}>
          <AbsencesMetricsSection customerName={customerName} />
        </DefaultAccordion>
        <DefaultAccordion label="No-Show Rates by Month" defaultExpanded={true}>
          <NoShowRatesByMonthSection customerName={customerName} />
        </DefaultAccordion>
        <DefaultAccordion label="No-Show Rates by Week" defaultExpanded={true}>
          <NoShowRatesByWeekSection customerName={customerName} />
        </DefaultAccordion>

        <Box sx={{ mb: 2 }}></Box>
      </Box>
    </>
  )
}

type SessionListSectionProps = {
  customerName: string
}

const SessionListSection: React.FC<SessionListSectionProps> = ({
  customerName,
}) => {
  const { customerSessionGroups } = useContext(SessionsContext)
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

type AbsencesMetricsSectionProps = {
  customerName: string
}

const AbsencesMetricsSection: React.FC<AbsencesMetricsSectionProps> = ({
  customerName,
}) => {
  const { customerSessionGroups } = useContext(SessionsContext)
  return (
    <DefaultGrid direction="row">
      <DefaultGridItem>
        <NoShowPieChart
          chartTitle={"Overall No-Show Rate"}
          presences={
            customerSessionGroups!
              .getSessionGroupForName(customerName)!
              .presences()!
          }
          absences={
            customerSessionGroups!
              .getSessionGroupForName(customerName)!
              .absences()!
          }
        />
      </DefaultGridItem>
      <DefaultGridItem>
        <DefaultHeader>
          Total No-Show Rate:{" "}
          {formatPercent(
            customerSessionGroups!
              .getSessionGroupForName(customerName)!
              .presences()! +
              customerSessionGroups!
                .getSessionGroupForName(customerName)!
                .absences()! ===
              0
              ? 0
              : customerSessionGroups!
                  .getSessionGroupForName(customerName)!
                  .absences()! /
                  (customerSessionGroups!
                    .getSessionGroupForName(customerName)!
                    .presences()! +
                    customerSessionGroups!
                      .getSessionGroupForName(customerName)!
                      .absences()!)
          )}
        </DefaultHeader>
      </DefaultGridItem>
    </DefaultGrid>
  )
}

type NoShowRatesByMonthSectionProps = {
  customerName: string
}

const NoShowRatesByMonthSection: React.FC<NoShowRatesByMonthSectionProps> = ({
  customerName,
}) => {
  const { customerSessionGroups } = useContext(SessionsContext)
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

type NoShowRatesByWeekSectionProps = {
  customerName: string
}

const NoShowRatesByWeekSection: React.FC<NoShowRatesByWeekSectionProps> = ({
  customerName,
}) => {
  const { customerSessionGroups } = useContext(SessionsContext)
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
