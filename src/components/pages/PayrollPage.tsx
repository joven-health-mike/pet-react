// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor, { createContractor } from "../../data/Contractor"
import Session, { createSession } from "../../data/Session"
import PayrollCalculator from "../../utils/PayrollCalculator"
import { handleUploadData } from "../../utils/DataProcessor"
import { downloadCsv } from "../../utils/CsvHelper"
import { HEADERS, createPayrollLine } from "../../outputs/Payroll"

const CustomButton = styled.button`
  ${buttonStyles}
`

const PayrollPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  const onRunPayrollClicked = () => {
    if (contractors.length === 0 || sessions.length === 0) {
      alert("Cannot run payroll because not all of the data has been uploaded.")
    } else {
      processAndDownloadPayroll()
    }
  }

  const processAndDownloadPayroll = () => {
    const contractorHours = new PayrollCalculator(
      contractors,
      sessions
    ).calculate()

    var csvOutput: string = HEADERS

    contractorHours.forEach((hours, contractor) => {
      csvOutput += createPayrollLine(contractor, hours.totalHours.toString())
    })
    downloadCsv(csvOutput, "payroll.csv")
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Grid container direction="column" alignItems="center">
        <UploadDataWidget
          prompt="Contractors"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setContractors, createContractor)
          }
          onDataCleared={() => {
            setContractors([])
          }}
        />
        <UploadDataWidget
          prompt="Provider Report"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setSessions, createSession)
          }
          onDataCleared={() => {
            setSessions([])
          }}
        />
        <CustomButton onClick={onRunPayrollClicked}>Run Payroll</CustomButton>
      </Grid>
    </>
  )
}

export default PayrollPage
