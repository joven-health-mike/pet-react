// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor, { createContractor } from "../../data/Contractor"
import Session, { createSession } from "../../data/Session"
import PayrollCalculator from "../../utils/PayrollCalculator"
import { handleUploadData } from "../../utils/DataProcessor"
import { downloadCsv } from "../../utils/CsvHelper"
import { PAYROLL_HEADERS, createPayrollLine } from "../../outputs/Payroll"
import { adaptTeleTeachersDataForPayroll } from "../../utils/TeleTeachersAdapter"
import {
  TRANSACTION_HEADERS,
  createTransactionLine,
} from "../../outputs/Transactions"
import { todaysDate } from "../../utils/DateUtils"

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

  const onCreateTransactionsClicked = () => {
    if (contractors.length === 0 || sessions.length === 0) {
      alert(
        "Cannot create transactions because not all of the data has been uploaded."
      )
    } else {
      processAndDownloadTransactions()
    }
  }

  const processAndDownloadTransactions = () => {
    const contractorHours = new PayrollCalculator(
      contractors,
      sessions
    ).calculate()

    let csvOutput: string = TRANSACTION_HEADERS
    const today = todaysDate()

    contractorHours.forEach((hours, contractor) => {
      const wage = (hours.totalHours() * parseFloat(contractor.hourlyRate))
        .toFixed(2)
        .toString()
      csvOutput += createTransactionLine([
        today,
        wage,
        contractor.counselorName,
      ])
    })
    downloadCsv(csvOutput, "transactions.csv")
  }

  const processAndDownloadPayroll = () => {
    const contractorHours = new PayrollCalculator(
      contractors,
      sessions
    ).calculate()

    var csvOutput: string = PAYROLL_HEADERS

    contractorHours.forEach((hours, contractor) => {
      csvOutput += createPayrollLine(contractor, hours.totalHours().toString())
    })
    downloadCsv(csvOutput, "payroll.csv")
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Payroll
      </Typography>
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
        <CustomButton onClick={onRunPayrollClicked}>Run Payroll</CustomButton>
        <CustomButton onClick={onCreateTransactionsClicked}>
          Create Transactions
        </CustomButton>
      </Grid>
    </>
  )
}

export default PayrollPage
