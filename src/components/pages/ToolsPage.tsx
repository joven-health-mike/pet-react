// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid } from "@mui/material"
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
      <Grid container direction="column" alignItems="center">
        <UploadDataWidget
          prompt="Provider Report (TeleTeachers)"
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
        <CustomButton onClick={onConvertClicked}>
          Convert TeleTeachers Data to SAD Format
        </CustomButton>
      </Grid>
    </>
  )
}

export default ToolsPage
