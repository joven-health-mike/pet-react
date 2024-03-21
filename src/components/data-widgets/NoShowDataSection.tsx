// Copyright 2022 Social Fabric, LLC

import React from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
} from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import NoShowChart from "./NoShowChart"

const CUSTOMER_CHART_LABEL = "No-Show Rates by Customer"
const PROVIDER_CHART_LABEL = "No-Show Rates by Provider"

type NoShowDataSectionProps = {
  customerData: Map<string, number>
  providerData: Map<string, number>
}

const NoShowDataSection: React.FC<NoShowDataSectionProps> = ({
  customerData,
  providerData,
}) => {
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
          <NoShowChart chartTitle={CUSTOMER_CHART_LABEL} data={customerData} />
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
          <NoShowChart chartTitle={PROVIDER_CHART_LABEL} data={providerData} />
        </AccordionDetails>
      </Accordion>
    </>
  )
}

export default NoShowDataSection
