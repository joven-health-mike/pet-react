// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import { handleUploadData } from "../../utils/DataProcessor"
import { adaptTeleTeachersDataForPayroll } from "../../utils/TeleTeachersAdapter"
import Session, { createSession } from "../../data/Session"
import {
  SAD_HEADERS,
  createSadLine,
} from "../../outputs/SessionAnalysisDashboard"
import { downloadCsv } from "../../utils/CsvHelper"
import HorizontalLine from "../widgets/HorizontalLine"

const CustomButton = styled.button`
  ${buttonStyles}
`

const ToolsPage: React.FC = () => {
  const [sessions, setSessions] = useState<Session[]>([])

  const onConvertClicked = () => {
    if (sessions.length === 0) {
      alert(
        'Please upload a Provider Timesheet Audit as "Tabular data" in TeleTeachers.'
      )
    } else {
      processAndDownloadSadData()
    }
  }

  const processAndDownloadSadData = () => {
    let csvOutput = SAD_HEADERS
    sessions.map((session) => (csvOutput += createSadLine(session)))
    downloadCsv(csvOutput, "sad.csv")
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Tools
      </Typography>
      <Grid container direction="column" alignItems="center">
        <UploadDataWidget
          prompt="Provider Report (TeleTeachers)"
          subPrompt="This is a report exported from **TeleTeachers**."
          onDataLoaded={(data: string[][]) =>
            handleUploadData(
              adaptTeleTeachersDataForPayroll(data),
              setSessions,
              createSession
            )
          }
          onDataCleared={() => {
            setSessions([])
          }}
        />
        <HorizontalLine />
        <Grid container direction={"row"} alignItems={"center"} sx={{ p: 1 }}>
          <Grid
            item
            xs={true}
            sm={true}
            md={true}
            lg={true}
            xl={true}
            sx={{ p: 1 }}
          >
            <CustomButton onClick={onConvertClicked}>
              Convert TeleTeachers Data to SAD Format
            </CustomButton>
          </Grid>
        </Grid>
      </Grid>
    </>
  )
}

export default ToolsPage
