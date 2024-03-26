// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import { Box } from "@mui/material"
import NoShowChart from "./charts/NoShowChart"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { sortMapByValue } from "../../utils/SortUtils"
import AllHoursStackedBarChart from "./charts/AllHoursStackedBarChart"
import { shiftedMonths } from "../../utils/DateUtils"
import AllHoursLineChart from "./charts/AllHoursLineChart"
import AllProvidersStackedBarChart from "./charts/AllProvidersStackedBarChart"
import DefaultAccordionGroup from "../widgets/DefaultAccordionGroup"
import Printable from "../widgets/Printable"
import CustomerFilter from "./CustomerFilter"

const CHART_MONTH_OFFSET = 6
const TITLE = "Joven Health Analytics"

// TODO: Add new component which allows filtering customers/providers that are included in the graph data

const JovenDataSection: React.FC = () => {
  return (
    <>
      <DefaultHeader>{TITLE}</DefaultHeader>
      <Box
        sx={{ m: 2 }}
        flexDirection={"column"}
        justifyContent="center"
        display="flex"
      >
        <CustomerFilter />
        <Printable docTitle={`${TITLE}.pdf`}>
          <DefaultAccordionGroup
            labels={[
              "Total Hours Delivered by Month",
              "Service Hours Delivered by Month",
              "Provider Hours Delivered by Month",
              "No-Show Rates by Customer",
              "No-Show Rates by Provider",
            ]}
            nodes={[
              <AllHoursLineSection label={"Total Hours Delivered by Month"} />,
              <AllHoursStackedSection
                label={"Service Hours Delivered by Month"}
              />,
              <HoursByProviderSection
                label={"Provider Hours Delivered by Month"}
              />,
              <CustomerNoShowSection label={"No-Show Rates by Customer"} />,
              <ProviderNoShowSection label={"No-Show Rates by Provider"} />,
            ]}
            defaultExpanded={[true, true, true, true, true]}
          />
        </Printable>
      </Box>
    </>
  )
}

type AllHoursLineSectionProps = {
  label: string
}

const AllHoursLineSection: React.FC<AllHoursLineSectionProps> = ({ label }) => {
  const { typeSessionGroups } = useContext(SessionsContext)
  const [hoursByMonthData, setHoursByMonthData] = useState<Map<string, number>>(
    new Map()
  )

  useEffect(() => {
    if (!typeSessionGroups) {
      setHoursByMonthData(new Map())
      return
    }

    const newData: Map<string, number> = new Map()

    for (const sessionGroup of typeSessionGroups) {
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
  }, [typeSessionGroups])

  return (
    <>
      {hoursByMonthData && (
        <AllHoursLineChart chartTitle={label} data={hoursByMonthData} />
      )}
    </>
  )
}

type AllHoursStackedSectionProps = {
  label: string
}

const AllHoursStackedSection: React.FC<AllHoursStackedSectionProps> = ({
  label,
}) => {
  const { typeSessionGroups } = useContext(SessionsContext)
  const [hoursByServiceData, setHoursByServiceData] = useState<
    Map<string, Map<string, number>>
  >(new Map())

  useEffect(() => {
    if (!typeSessionGroups) {
      setHoursByServiceData(new Map())
      return
    }

    const newData: Map<string, Map<string, number>> = new Map()

    for (const sessionGroup of typeSessionGroups) {
      const monthlyMap = new Map()
      const monthGenerator = shiftedMonths(CHART_MONTH_OFFSET)
      for (const month of monthGenerator) {
        const hoursForMonth = sessionGroup.totalHours(month)
        const newHoursValue = (monthlyMap.get(month) ?? 0) + hoursForMonth
        monthlyMap.set(month, newHoursValue)
      }
      newData.set(sessionGroup.name, monthlyMap)
    }

    setHoursByServiceData(newData)
  }, [typeSessionGroups])

  return (
    <>
      {hoursByServiceData && (
        <AllHoursStackedBarChart chartTitle={label} data={hoursByServiceData} />
      )}
    </>
  )
}

type HoursByProviderSectionProps = {
  label: string
}

const HoursByProviderSection: React.FC<HoursByProviderSectionProps> = ({
  label,
}) => {
  const [hoursByProviderData, setHoursByProviderData] = useState<
    Map<string, Map<string, number>>
  >(new Map())
  const { providerSessionGroups } = useContext(SessionsContext)

  useEffect(() => {
    if (!providerSessionGroups) {
      setHoursByProviderData(new Map())
      return
    }
    // TODO: For any provider who has less than 10 hours/month, bundle them into an "Other" category
    const newData: Map<string, Map<string, number>> = new Map()

    for (const sessionGroup of providerSessionGroups) {
      const monthlyMap = new Map()
      const monthGenerator = shiftedMonths(CHART_MONTH_OFFSET)
      for (const month of monthGenerator) {
        const hoursForMonth = sessionGroup.totalHours(month)
        const newHoursValue = (monthlyMap.get(month) ?? 0) + hoursForMonth
        monthlyMap.set(month, newHoursValue)
      }
      newData.set(sessionGroup.name, monthlyMap)
    }

    setHoursByProviderData(newData)
  }, [providerSessionGroups])

  return (
    <>
      {hoursByProviderData && (
        <AllProvidersStackedBarChart
          chartTitle={label}
          data={hoursByProviderData}
        />
      )}
    </>
  )
}

type CustomerNoShowSectionProps = {
  label: string
}

const CustomerNoShowSection: React.FC<CustomerNoShowSectionProps> = ({
  label,
}) => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const [customerNoShowData, setCustomerNoShowData] =
    useState<Map<string, number>>()

  useEffect(() => {
    if (!customerSessionGroups) {
      setCustomerNoShowData(new Map())
      return
    }

    const customerAbsentRates = new Map<string, number>()

    for (const sessionGroup of customerSessionGroups) {
      // filter out customers with 0 absent rate
      if (sessionGroup.absentRate() > 0) {
        customerAbsentRates.set(sessionGroup.name, sessionGroup.absentRate())
      }
    }

    setCustomerNoShowData(sortMapByValue(customerAbsentRates))
  }, [customerSessionGroups])

  return (
    <>
      {customerNoShowData && (
        <NoShowChart chartTitle={label} data={customerNoShowData} />
      )}
    </>
  )
}

type ProviderNoShowSectionProps = {
  label: string
}

const ProviderNoShowSection: React.FC<ProviderNoShowSectionProps> = ({
  label,
}) => {
  const { providerSessionGroups } = useContext(SessionsContext)
  const [providerNoShowData, setProviderNoShowData] =
    useState<Map<string, number>>()

  useEffect(() => {
    if (!providerSessionGroups) {
      setProviderNoShowData(new Map())
      return
    }

    const providerAbsentRates = new Map<string, number>()

    for (const sessionGroup of providerSessionGroups) {
      if (sessionGroup.absentRate() > 0) {
        providerAbsentRates.set(sessionGroup.name, sessionGroup.absentRate())
      }
    }
    setProviderNoShowData(sortMapByValue(providerAbsentRates))
  }, [providerSessionGroups])

  return (
    <>
      {providerNoShowData && (
        <NoShowChart chartTitle={label} data={providerNoShowData} />
      )}
    </>
  )
}

export default JovenDataSection
