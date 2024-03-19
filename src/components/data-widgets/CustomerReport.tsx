// Copyright 2022 Social Fabric, LLC

import React from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSubHeader from "../widgets/DefaultSubHeader"
import { Typography } from "@mui/material"

type CustomerReportProps = {
  customerName: string
  reportEntries: Map<string, string[]>
}

const CustomerReport: React.FC<CustomerReportProps> = ({
  customerName,
  reportEntries,
}) => {
  return (
    <>
      <DefaultHeader>{customerName}</DefaultHeader>
      {Array.from(reportEntries.entries()).map((entry, entryIndex) => {
        const sectionHeader = entry[0]
        const sectionItems = entry[1]

        return (
          <>
            <DefaultSubHeader key={entryIndex}>
              {sectionHeader}
            </DefaultSubHeader>
            {sectionItems.map((itemEntry, itemIndex) => {
              return <Typography key={itemIndex}>{itemEntry}</Typography>
            })}
          </>
        )
      })}
    </>
  )
}

export default CustomerReport
