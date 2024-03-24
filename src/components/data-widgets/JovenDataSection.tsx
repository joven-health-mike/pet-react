// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
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
import { MONTH_NAMES } from "../../utils/DateUtils"
import AllHoursLineChart from "./charts/AllHoursLineChart"

const CUSTOMER_CHART_LABEL = "No-Show Rates by Customer"
const PROVIDER_CHART_LABEL = "No-Show Rates by Provider"
const SERVICES_CHART_LABEL = "Service Hours Delivered by Month"
const TOTAL_HOURS_CHART_LABEL = "Total Hours Delivered by Month"

const JovenDataSection: React.FC = () => {
  const { customerSessionGroups, providerSessionGroups, typeSessionGroups } =
    useContext(SessionsContext)
  const [customerNoShowData, setCustomerNoShowData] =
    useState<Map<string, number>>()
  const [providerNoShowData, setProviderNoShowData] =
    useState<Map<string, number>>()
  const [hoursByServiceData, setHoursByServiceData] = useState<
    Map<string, Map<string, number>>
  >(new Map())
  const [hoursByMonthData, setHoursByMonthData] = useState<Map<string, number>>(
    new Map()
  )

  useEffect(() => {
    if (typeSessionGroups !== undefined) {
      const newData: Map<string, number> = new Map()

      for (const sessionGroup of typeSessionGroups) {
        for (const month of MONTH_NAMES) {
          const shiftedMonth =
            MONTH_NAMES[(MONTH_NAMES.indexOf(month) + 6) % 12]
          const hoursForMonth = sessionGroup.totalHours(shiftedMonth)
          const newHoursValue = (newData.get(shiftedMonth) || 0) + hoursForMonth
          newData.set(shiftedMonth, newHoursValue)
        }
      }

      // round all values after adding them up. reduces error
      for (const [key, value] of newData.entries()) {
        const roundedValue = parseFloat(value.toFixed(1))
        newData.set(key, roundedValue)
      }

      setHoursByMonthData(newData)
    }
  }, [typeSessionGroups])

  useEffect(() => {
    if (typeSessionGroups !== undefined) {
      const newData: Map<string, Map<string, number>> = new Map()

      for (const serviceName of typeSessionGroups.getNames()) {
        const sessionGroup =
          typeSessionGroups.getSessionGroupForName(serviceName)!
        for (const month of MONTH_NAMES) {
          const shiftedMonth =
            MONTH_NAMES[(MONTH_NAMES.indexOf(month) + 6) % 12]
          const hoursForMonth = sessionGroup.totalHours(shiftedMonth)
          const monthlyMap = newData.get(serviceName) ?? new Map()
          const newHoursValue =
            (monthlyMap.get(shiftedMonth) ?? 0) + hoursForMonth
          monthlyMap.set(shiftedMonth, newHoursValue)
          newData.set(serviceName, monthlyMap)
        }
      }

      setHoursByServiceData(newData)
    }
  }, [typeSessionGroups])

  useEffect(() => {
    if (customerSessionGroups !== undefined) {
      const customerAbsentRates = new Map<string, number>()
      const customerNames = customerSessionGroups.getNames()
      customerNames.forEach((customerName) => {
        const sessionGroup =
          customerSessionGroups.getSessionGroupForName(customerName)!
        // filter out customers with 0 absent rate
        if (sessionGroup.absentRate() > 0) {
          customerAbsentRates.set(customerName, sessionGroup.absentRate())
        }
      })
      setCustomerNoShowData(sortMapByValue(customerAbsentRates))
    }
  }, [customerSessionGroups])

  useEffect(() => {
    if (providerSessionGroups !== undefined) {
      const providerAbsentRates = new Map<string, number>()
      const providerNames = providerSessionGroups.getNames()
      providerNames.forEach((providerName) => {
        const sessionGroup =
          providerSessionGroups.getSessionGroupForName(providerName)!
        // filter out customers with 0 absent rate
        if (sessionGroup.absentRate() > 0) {
          providerAbsentRates.set(providerName, sessionGroup.absentRate())
        }
      })
      setProviderNoShowData(sortMapByValue(providerAbsentRates))
    }
  }, [providerSessionGroups])

  return (
    <>
      <DefaultHeader>Joven Health Analytics</DefaultHeader>
      <Box sx={{ m: 2 }}>
        {hoursByMonthData !== undefined && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              id="panel-header"
              aria-controls="panel-content"
            >
              {TOTAL_HOURS_CHART_LABEL}
            </AccordionSummary>
            <AccordionDetails>
              <AllHoursLineChart
                chartTitle={TOTAL_HOURS_CHART_LABEL}
                data={hoursByMonthData}
              />
            </AccordionDetails>
          </Accordion>
        )}
        {hoursByServiceData !== undefined && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              id="panel-header"
              aria-controls="panel-content"
            >
              {SERVICES_CHART_LABEL}
            </AccordionSummary>
            <AccordionDetails>
              <AllHoursStackedBarChart
                chartTitle={SERVICES_CHART_LABEL}
                data={hoursByServiceData}
              />
            </AccordionDetails>
          </Accordion>
        )}
        {customerNoShowData !== undefined && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              id="panel-header"
              aria-controls="panel-content"
            >
              {CUSTOMER_CHART_LABEL}
            </AccordionSummary>
            <AccordionDetails>
              <NoShowChart
                chartTitle={CUSTOMER_CHART_LABEL}
                data={customerNoShowData}
              />
            </AccordionDetails>
          </Accordion>
        )}
        {providerNoShowData !== undefined && (
          <Accordion>
            <AccordionSummary
              expandIcon={<ArrowDropDownIcon />}
              id="panel-header"
              aria-controls="panel-content"
            >
              {PROVIDER_CHART_LABEL}
            </AccordionSummary>
            <AccordionDetails>
              <NoShowChart
                chartTitle={PROVIDER_CHART_LABEL}
                data={providerNoShowData}
              />
            </AccordionDetails>
          </Accordion>
        )}
      </Box>
    </>
  )
}

export default JovenDataSection
