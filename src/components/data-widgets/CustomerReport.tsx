// Copyright 2022 Social Fabric, LLC

import React from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSubHeader from "../widgets/DefaultSubHeader"
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import NoShowPieChart from "./NoShowPieChart"
import { formatPercent } from "../../utils/MathUtils"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"

type CustomerReportProps = {
  customerName: string
  reportEntries: Map<string, string[]>
  presences: number
  absences: number
}

const CustomerReport: React.FC<CustomerReportProps> = ({
  customerName,
  reportEntries,
  presences,
  absences,
}) => {
  return (
    <>
      <Box
        flexDirection={"column"}
        justifyContent="center"
        display="flex"
        sx={{ p: 2 }}
      >
        <DefaultHeader props={{ mt: 0 }}>{customerName}</DefaultHeader>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            Session List
          </AccordionSummary>
          <AccordionDetails>
            {Array.from(reportEntries.entries())
              .sort()
              .map((entry, entryIndex) => {
                const sectionHeader = entry[0]
                const sectionItems = entry[1]

                return (
                  <>
                    <DefaultSubHeader props={{ mt: 0 }} key={entryIndex}>
                      {sectionHeader}
                    </DefaultSubHeader>
                    {sectionItems.map((itemEntry, itemIndex) => {
                      return (
                        <Typography key={itemIndex}>{itemEntry}</Typography>
                      )
                    })}
                  </>
                )
              })}
          </AccordionDetails>
        </Accordion>
        <Accordion>
          <AccordionSummary
            expandIcon={<ArrowDropDownIcon />}
            id="panel-header"
            aria-controls="panel-content"
          >
            Absence Metrics
          </AccordionSummary>
          <AccordionDetails>
            <DefaultGrid direction="row">
              <DefaultGridItem>
                <NoShowPieChart presences={presences} absences={absences} />
              </DefaultGridItem>
              <DefaultGridItem>
                <DefaultHeader>
                  Absent Rate:{" "}
                  {formatPercent(
                    presences + absences === 0
                      ? 0
                      : absences / (presences + absences)
                  )}
                </DefaultHeader>
              </DefaultGridItem>
            </DefaultGrid>
          </AccordionDetails>
        </Accordion>
        <Box sx={{ mb: 2 }}></Box>
      </Box>
    </>
  )
}

export default CustomerReport
