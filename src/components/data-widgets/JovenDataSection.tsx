// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useRef, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import NoShowChart from "./charts/NoShowChart"
import { SessionsContext } from "../../data/providers/SessionProvider"
import { sortMapByValue } from "../../utils/SortUtils"
import AllHoursStackedBarChart from "./charts/AllHoursStackedBarChart"
import { shiftedMonths } from "../../utils/DateUtils"
import AllHoursLineChart from "./charts/AllHoursLineChart"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { useReactToPrint } from "react-to-print"
import AllProvidersStackedBarChart from "./charts/AllProvidersStackedBarChart"

const CustomButton = styled.button`
  ${buttonStyles}
  width: 300px;
`

const CHART_MONTH_OFFSET = 6

const JovenDataSection: React.FC = () => {
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle: "Joven Health Report.pdf",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  })

  return (
    <>
      <DefaultHeader>Joven Health Analytics</DefaultHeader>
      <Box sx={{ m: 2 }}>
        <CustomButton onClick={handlePrint}>Download PDF</CustomButton>
        <div ref={componentRef}>
          <AllHoursLineSection />
          <AllHoursStackedSection />
          <HoursByProviderSection />
          <CustomerNoShowSection />
          <ProviderNoShowSection />
        </div>
      </Box>
    </>
  )
}

const AllHoursLineSection: React.FC = () => {
  const CHART_LABEL = "Total Hours Delivered by Month"
  const { typeSessionGroups } = useContext(SessionsContext)
  const [hoursByMonthData, setHoursByMonthData] = useState<Map<string, number>>(
    new Map()
  )

  useEffect(() => {
    if (!typeSessionGroups) return

    const newData: Map<string, number> = new Map()

    for (const sessionGroup of typeSessionGroups) {
      const monthGenerator = shiftedMonths(CHART_MONTH_OFFSET)
      for (const month of monthGenerator) {
        console.log(`month: ${month}`)
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
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            {CHART_LABEL}
          </AccordionSummary>
          <AccordionDetails>
            <AllHoursLineChart
              chartTitle={CHART_LABEL}
              data={hoursByMonthData}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}

const AllHoursStackedSection: React.FC = () => {
  const CHART_LABEL = "Service Hours Delivered by Month"
  const { typeSessionGroups } = useContext(SessionsContext)
  const [hoursByServiceData, setHoursByServiceData] = useState<
    Map<string, Map<string, number>>
  >(new Map())

  useEffect(() => {
    if (!typeSessionGroups) return

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
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            {CHART_LABEL}
          </AccordionSummary>
          <AccordionDetails>
            <AllHoursStackedBarChart
              chartTitle={CHART_LABEL}
              data={hoursByServiceData}
            />
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}

const HoursByProviderSection: React.FC = () => {
  const CHART_LABEL = "Provider Hours Delivered by Month"
  const [hoursByProviderData, setHoursByProviderData] = useState<
    Map<string, Map<string, number>>
  >(new Map())
  const { providerSessionGroups } = useContext(SessionsContext)

  useEffect(() => {
    if (!providerSessionGroups) return
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
      (
      {hoursByProviderData && (
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            {CHART_LABEL}
          </AccordionSummary>
          <AccordionDetails>
            <AllProvidersStackedBarChart
              chartTitle={CHART_LABEL}
              data={hoursByProviderData}
            />
          </AccordionDetails>
        </Accordion>
      )}
      )
    </>
  )
}

const CustomerNoShowSection: React.FC = () => {
  const CHART_LABEL = "No-Show Rates by Customer"
  const { customerSessionGroups } = useContext(SessionsContext)
  const [customerNoShowData, setCustomerNoShowData] =
    useState<Map<string, number>>()

  useEffect(() => {
    if (!customerSessionGroups) return

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
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            {CHART_LABEL}
          </AccordionSummary>
          <AccordionDetails>
            <NoShowChart chartTitle={CHART_LABEL} data={customerNoShowData} />
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}

const ProviderNoShowSection: React.FC = () => {
  const CHART_LABEL = "No-Show Rates by Provider"
  const { providerSessionGroups } = useContext(SessionsContext)
  const [providerNoShowData, setProviderNoShowData] =
    useState<Map<string, number>>()

  useEffect(() => {
    if (!providerSessionGroups) return

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
        <Accordion defaultExpanded={true}>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            {CHART_LABEL}
          </AccordionSummary>
          <AccordionDetails>
            <NoShowChart chartTitle={CHART_LABEL} data={providerNoShowData} />
          </AccordionDetails>
        </Accordion>
      )}
    </>
  )
}

export default JovenDataSection
