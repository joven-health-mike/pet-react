// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
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
import HorizontalLine from "../widgets/HorizontalLine"

const CustomButton = styled.button`
  ${buttonStyles}
  width:250px;
`

const PayrollPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [readyToDownload, setReadyToDownload] = useState<boolean>(false)

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

  useEffect(() => {
    if (sessions.length > 0 && contractors.length > 0) {
      setReadyToDownload(true)
    }
  }, [contractors.length, sessions.length])

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Payroll
      </Typography>
      <Grid container direction="column" alignItems="center">
        <>
          <UploadDataWidget
            prompt="Contractors"
            subPrompt="Data for contractors can be found in the **PET Program Inputs** sheet."
            onDataLoaded={(data: string[][]) => {
              handleUploadData(data, setContractors, createContractor)
            }}
            onDataCleared={() => {
              setContractors([])
            }}
          />
          <HorizontalLine />
        </>
        <>
          <UploadDataWidget
            prompt="Provider Report"
            subPrompt="The Provider Report can be exported from either the **Session Analysis Dashboard (SAD)** or from **TeleTeachers**. Select the option that coorelates with where the data was exported from."
            button1Text={"Upload SAD Format"}
            button2Text={"Upload TeleTeachers Format"}
            enableSecondOption={true}
            onDataLoaded={(data: string[][]) => {
              handleUploadData(data, setSessions, createSession)
            }}
            onDataCleared={() => {
              setSessions([])
              setReadyToDownload(false)
            }}
            onData2Loaded={(data: string[][]) => {
              handleUploadData(
                adaptTeleTeachersDataForPayroll(data),
                setSessions,
                createSession
              )
            }}
            onData2Cleared={() => {
              setSessions([])
              setReadyToDownload(false)
            }}
          />
          <HorizontalLine />
        </>
        {readyToDownload && (
          <>
            <Typography variant="h5" sx={{ mt: 3 }}>
              What would you like to do?
            </Typography>
            <Grid
              container
              direction={"row"}
              alignItems={"center"}
              sx={{ p: 1 }}
            >
              <Grid
                item
                xs={true}
                sm={true}
                md={true}
                lg={true}
                xl={true}
                sx={{ p: 1 }}
              >
                <CustomButton onClick={() => processAndDownloadPayroll()}>
                  Download Payroll File
                </CustomButton>
              </Grid>
              <Grid
                item
                xs={true}
                sm={true}
                md={true}
                lg={true}
                xl={true}
                sx={{ p: 1 }}
              >
                <CustomButton onClick={() => processAndDownloadTransactions()}>
                  Download Transactions File
                </CustomButton>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default PayrollPage
