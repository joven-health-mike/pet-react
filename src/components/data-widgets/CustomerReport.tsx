// Copyright 2022 Social Fabric, LLC

import React from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSubHeader from "../widgets/DefaultSubHeader"
import { Box, Typography } from "@mui/material"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import NoShowPieChart from "./NoShowPieChart"
import { formatPercent } from "../../utils/MathUtils"

type CustomerReportProps = {
  customerName: string
  reportEntries: Map<string, string[]>
  absentRate: number
}

const CustomerReport: React.FC<CustomerReportProps> = ({
  customerName,
  reportEntries,
  absentRate,
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
                  return <Typography key={itemIndex}>{itemEntry}</Typography>
                })}
              </>
            )
          })}
        <DefaultGrid direction="row">
          <DefaultGridItem>
            <NoShowPieChart
              chartTitle="Present/Absent Ratio"
              absentRate={absentRate}
            />
          </DefaultGridItem>
          <DefaultGridItem>
            <DefaultHeader>
              Absent Rate: {formatPercent(absentRate)}
            </DefaultHeader>
          </DefaultGridItem>
        </DefaultGrid>
        <Box sx={{ mb: 2 }}></Box>
      </Box>
    </>
  )
}

export default CustomerReport
