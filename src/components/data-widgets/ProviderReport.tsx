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
import { ProviderSessionGroupsContext } from "../pages/AnalyticsPage"
import { shiftedMonths } from "../../utils/DateUtils"
import AllHoursLineChart from "./charts/AllHoursLineChart"
import AllHoursStackedBarChart from "./charts/AllHoursStackedBarChart"
import { createSessionGroups } from "../../data/SessionGroups"
import { byCustomer, byType } from "./SelectByName"
import Printable from "../widgets/Printable"

const CHART_MONTH_OFFSET = 6

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
        <Printable docTitle={`Provider Report - ${providerName}`}>
          <DefaultHeader props={{ mt: 0 }}>{providerName}</DefaultHeader>

          <DefaultAccordionGroup
            labels={[
              "Service Overview",
              "Absence Metrics",
              "No-Show Rates by Month",
              "No-Show Rates by Week",
              "Hours Delivered",
              "Services Delivered",
              "Customers Serviced",
            ]}
            nodes={[
              <ServiceOverviewSection />,
              <AbsencesMetricsSection />,
              <NoShowRatesByMonthSection />,
              <NoShowRatesByWeekSection />,
              <ProviderHoursLineSection />,
              <ProviderHoursStackedSection />,
              <ProviderCustomerStackedSection />,
            ]}
            defaultExpanded={[false, false, false, false, false, false, true]}
          />
        </Printable>

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

const ProviderHoursLineSection: React.FC = () => {
  const filteredTypeSessionGroups = useContext(ProviderSessionGroupsContext)
  const providerName = useContext(ProviderNameContext)
  const [hoursByMonthData, setHoursByMonthData] = useState<Map<string, number>>(
    new Map()
  )

  useEffect(() => {
    if (!filteredTypeSessionGroups) {
      setHoursByMonthData(new Map())
      return
    }

    const newData: Map<string, number> = new Map()

    for (const sessionGroup of filteredTypeSessionGroups) {
      if (sessionGroup.name !== providerName) continue
      const monthGenerator = shiftedMonths(CHART_MONTH_OFFSET)
      for (const month of monthGenerator) {
        const hoursForMonth = sessionGroup.totalHours(month)
        const newHoursValue = (newData.get(month) ?? 0) + hoursForMonth
        newData.set(month, newHoursValue)
      }
    }

    // round all values after adding them up. reduces error
    for (const [key, value] of newData.entries()) {
      newData.set(key, parseFloat(value.toFixed(1)))
    }

    setHoursByMonthData(newData)
  }, [filteredTypeSessionGroups, providerName])

  return (
    <>
      {hoursByMonthData && (
        <AllHoursLineChart
          chartTitle={"Hours Delivered"}
          data={hoursByMonthData}
        />
      )}
    </>
  )
}

const ProviderHoursStackedSection: React.FC = () => {
  const filteredProviderSessionGroups = useContext(ProviderSessionGroupsContext)
  const providerName = useContext(ProviderNameContext)
  const [hoursByServiceData, setHoursByServiceData] = useState<
    Map<string, Map<string, number>>
  >(new Map())

  useEffect(() => {
    if (!filteredProviderSessionGroups) {
      setHoursByServiceData(new Map())
      return
    }

    const newData: Map<string, Map<string, number>> = new Map()

    for (const sessionGroup of filteredProviderSessionGroups) {
      if (sessionGroup.name !== providerName) continue
      const providerSessions = [...sessionGroup]

      const typeSessionGroups = createSessionGroups(providerSessions, byType)

      for (const typeSessionGroup of typeSessionGroups) {
        const monthlyMap = new Map()
        const monthGenerator = shiftedMonths(CHART_MONTH_OFFSET)
        for (const month of monthGenerator) {
          const hoursForMonth = typeSessionGroup.totalHours(month)
          const newHoursValue = (monthlyMap.get(month) ?? 0) + hoursForMonth
          monthlyMap.set(month, newHoursValue)
        }
        newData.set(typeSessionGroup.name, monthlyMap)
      }
    }

    setHoursByServiceData(newData)
  }, [filteredProviderSessionGroups, providerName])

  return (
    <>
      {hoursByServiceData && (
        <AllHoursStackedBarChart
          chartTitle={"Services Delivered"}
          data={hoursByServiceData}
        />
      )}
    </>
  )
}

const ProviderCustomerStackedSection: React.FC = () => {
  const filteredProviderSessionGroups = useContext(ProviderSessionGroupsContext)
  const providerName = useContext(ProviderNameContext)
  const [hoursByServiceData, setHoursByServiceData] = useState<
    Map<string, Map<string, number>>
  >(new Map())

  useEffect(() => {
    if (!filteredProviderSessionGroups) {
      setHoursByServiceData(new Map())
      return
    }

    const newData: Map<string, Map<string, number>> = new Map()

    for (const sessionGroup of filteredProviderSessionGroups) {
      if (sessionGroup.name !== providerName) continue
      const providerSessions = [...sessionGroup]

      const customerSessionGroups = createSessionGroups(
        providerSessions,
        byCustomer
      )

      for (const customerSessionGroup of customerSessionGroups) {
        const monthlyMap = new Map()
        const monthGenerator = shiftedMonths(CHART_MONTH_OFFSET)
        for (const month of monthGenerator) {
          const hoursForMonth = customerSessionGroup.totalHours(month)
          const newHoursValue = (monthlyMap.get(month) ?? 0) + hoursForMonth
          monthlyMap.set(month, newHoursValue)
        }
        newData.set(customerSessionGroup.name, monthlyMap)
      }
    }

    setHoursByServiceData(newData)
  }, [filteredProviderSessionGroups, providerName])

  return (
    <>
      {hoursByServiceData && (
        <AllHoursStackedBarChart
          chartTitle={"Customers Serviced"}
          data={hoursByServiceData}
        />
      )}
    </>
  )
}

export default ProviderReport
