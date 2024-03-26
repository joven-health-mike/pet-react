// Copyright 2022 Social Fabric, LLC

import React, { ReactNode } from "react"
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

type DefaultAccordionProps = {
  children: ReactNode
  label: string
  defaultExpanded: boolean
}

const DefaultAccordion: React.FC<DefaultAccordionProps> = ({
  children,
  label = "",
  defaultExpanded = false,
}) => {
  return (
    <>
      <Accordion defaultExpanded={defaultExpanded}>
        <AccordionSummary
          expandIcon={<ArrowDropDownIcon />}
          id="panel-header"
          aria-controls="panel-content"
        >
          {label}
        </AccordionSummary>
        <AccordionDetails>{children}</AccordionDetails>
      </Accordion>
    </>
  )
}

export default DefaultAccordion
