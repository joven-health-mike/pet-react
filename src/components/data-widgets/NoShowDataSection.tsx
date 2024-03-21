// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import NoShowChart from "./NoShowChart"
import Session from "../../data/Session"
import SessionGroups, { createSessionGroups } from "../../data/SessionGroups"
import { sortMapByValue } from "../../utils/SortUtils"

const CUSTOMER_CHART_LABEL = "No-Show Rates by Customer"
const PROVIDER_CHART_LABEL = "No-Show Rates by Provider"

type NoShowDataSectionProps = {
  sessions: Session[]
}

const NoShowDataSection: React.FC<NoShowDataSectionProps> = ({ sessions }) => {
  const [customerNoShowData, setCustomerNoShowData] =
    useState<Map<string, number>>()
  const [providerNoShowData, setProviderNoShowData] =
    useState<Map<string, number>>()
  const [customerSessionGroups, setCustomerSessionGroups] =
    useState<SessionGroups>()
  const [providerSessionGroups, setProviderSessionGroups] =
    useState<SessionGroups>()

  useEffect(() => {
    if (sessions.length > 0) {
      setCustomerSessionGroups(
        createSessionGroups(sessions, (session: Session) => session.schoolName)
      )
      setProviderSessionGroups(
        createSessionGroups(
          sessions,
          (session: Session) => session.providerName
        )
      )
    } else {
      setCustomerSessionGroups(undefined)
      setProviderSessionGroups(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessions.length])

  useEffect(() => {
    if (customerSessionGroups !== undefined) {
      const customerAbsentRates = new Map<string, number>()
      const customerPresences = new Map<string, number>()
      const customerAbsences = new Map<string, number>()
      const customerNames = customerSessionGroups.getNames()
      customerNames.forEach((customerName) => {
        const sessionGroup =
          customerSessionGroups.getSessionGroupForName(customerName)!
        if (sessionGroup.absentRate() > 0) {
          customerAbsentRates.set(
            customerName,
            parseFloat((sessionGroup.absentRate() * 100).toFixed(3))
          )
        }
        customerPresences.set(customerName, sessionGroup.presences())
        customerAbsences.set(customerName, sessionGroup.absences())
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
        if (sessionGroup.absentRate() > 0) {
          providerAbsentRates.set(
            providerName,
            parseFloat((sessionGroup.absentRate() * 100).toFixed(3))
          )
        }
      })
      setProviderNoShowData(sortMapByValue(providerAbsentRates))
    }
  }, [providerSessionGroups])

  return (
    <>
      <DefaultHeader>No-Show Rates</DefaultHeader>
      <Box sx={{ mb: 2 }} />
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
            data={customerNoShowData!}
          />
        </AccordionDetails>
      </Accordion>
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
            data={providerNoShowData!}
          />
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default NoShowDataSection
