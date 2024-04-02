// Copyright 2022 Social Fabric, LLC

import React, { ReactNode, useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSubHeader from "../widgets/DefaultSubHeader"
import { Box } from "@mui/material"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import NoShowPieChart from "./charts/NoShowPieChart"
import { formatPercent } from "../../utils/MathUtils"
import NoShowLineChart from "./charts/NoShowLineChart"
import { SessionsContext } from "../../data/providers/SessionProvider"
import DefaultAccordionGroup from "../widgets/DefaultAccordionGroup"
import { sortMapByValue } from "../../utils/SortUtils"
import SessionGroup from "../../data/SessionGroup"
import { ProviderNameContext } from "./ProviderReportsSection"

const ProviderReport: React.FC = () => {
  const providerName = useContext(ProviderNameContext)
  return (
    <>
      <Box
        flexDirection={"column"}
        justifyContent="center"
        display="flex"
        sx={{ p: 2 }}
      >
        <DefaultHeader props={{ mt: 0 }}>{providerName}</DefaultHeader>

        <DefaultAccordionGroup
          labels={[
            "Service Overview",
            "Absence Metrics",
            "No-Show Rates by Month",
            "No-Show Rates by Week",
          ]}
          nodes={[
            <ServiceOverviewSection />,
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

const ServiceOverviewSection: React.FC = () => {
  const { providerSessionGroups } = useContext(SessionsContext)
  const providerName = useContext(ProviderNameContext)
  const [monthlyReportData, setMonthlyReportData] = useState<
    Map<string, number>
  >(new Map())
  const [reportViews, setReportViews] = useState<ReactNode[]>([])

  useEffect(() => {
    if (
      providerSessionGroups &&
      providerSessionGroups.getSessionGroupForName(providerName)
    ) {
      setMonthlyReportData(
        providerSessionGroups
          .getSessionGroupForName(providerName)!
          .sessionTypeTimes()
      )
    } else {
      setMonthlyReportData(new Map())
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerSessionGroups, providerName])

  useEffect(() => {
    const data = []

    for (const view of sessionListGenerator(
      sortMapByValue(monthlyReportData)
    )) {
      data.push(view)
    }
    setReportViews(data)
  }, [monthlyReportData])

  function* sessionListGenerator(monthlyReportData: Map<string, number>) {
    let i = 0
    for (const [key, value] of monthlyReportData.entries()) {
      yield (
        <DefaultSubHeader props={{ mt: 0 }} key={i}>
          {`${key}: ${(value / 60).toFixed(1)} hours`}
        </DefaultSubHeader>
      )
      i++
    }
  }

  return <>{reportViews}</>
}

const AbsencesMetricsSection: React.FC = () => {
  const { providerSessionGroups } = useContext(SessionsContext)
  const providerName = useContext(ProviderNameContext)
  const [presences, setPresences] = useState<number>(0)
  const [absences, setAbsences] = useState<number>(0)

  useEffect(() => {
    if (
      providerSessionGroups &&
      providerSessionGroups.getSessionGroupForName(providerName)
    ) {
      setPresences(
        providerSessionGroups.getSessionGroupForName(providerName)!.presences()
      )
      setAbsences(
        providerSessionGroups.getSessionGroupForName(providerName)!.absences()
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerSessionGroups, providerName])

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
  const { providerSessionGroups } = useContext(SessionsContext)
  const providerName = useContext(ProviderNameContext)
  const [currentSessionGroup, setCurrentSessionGroup] = useState<
    SessionGroup | undefined
  >(undefined)

  useEffect(() => {
    if (
      providerSessionGroups &&
      providerSessionGroups.getSessionGroupForName(providerName)
    ) {
      setCurrentSessionGroup(
        providerSessionGroups.getSessionGroupForName(providerName)
      )
    } else {
      setCurrentSessionGroup(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerSessionGroups, providerName])

  return (
    <>
      {currentSessionGroup && (
        <DefaultGrid direction="row">
          <DefaultGridItem>
            <NoShowLineChart
              chartTitle="No-Show Rate by Month"
              data={currentSessionGroup.noShowRatesByMonth()}
            />
          </DefaultGridItem>
        </DefaultGrid>
      )}
    </>
  )
}

const NoShowRatesByWeekSection: React.FC = () => {
  const { providerSessionGroups } = useContext(SessionsContext)
  const providerName = useContext(ProviderNameContext)
  const [currentSessionGroup, setCurrentSessionGroup] = useState<
    SessionGroup | undefined
  >(undefined)

  useEffect(() => {
    if (
      providerSessionGroups &&
      providerSessionGroups.getSessionGroupForName(providerName)
    ) {
      setCurrentSessionGroup(
        providerSessionGroups.getSessionGroupForName(providerName)
      )
    } else {
      setCurrentSessionGroup(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [providerSessionGroups, providerName])

  return (
    <>
      {currentSessionGroup && (
        <DefaultGrid direction="row">
          <DefaultGridItem>
            <NoShowLineChart
              chartTitle="No-Show Rate by Week"
              data={currentSessionGroup.noShowRatesByWeek()}
            />
          </DefaultGridItem>
        </DefaultGrid>
      )}
    </>
  )
}

export default ProviderReport
