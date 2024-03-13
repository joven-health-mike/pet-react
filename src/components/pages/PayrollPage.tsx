// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor from "../../data/Contractor"
import Session from "../../data/Session"
import PayrollCalculator from "../../utils/PayrollCalculator"

const CustomButton = styled.button`
  ${buttonStyles}
`

const PayrollPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [sessions, setSessions] = useState<Session[]>([])

  const onUploadContractorsClicked = (data: string[][]) => {
    const newContractors: Contractor[] = data.slice(1).map((datum) => {
      return new Contractor(datum[0], datum[1], datum[2], datum[3], datum[4])
    })

    setContractors(newContractors)
  }

  const onContractorsCleared = () => {
    setContractors([])
  }

  const onUploadProviderReportClicked = (data: string[][]) => {
    const newSessions: Session[] = data.slice(1).map((datum) => {
      return new Session(
        datum[0],
        datum[1],
        datum[2],
        datum[3],
        datum[4],
        datum[5],
        datum[6],
        datum[11],
        datum[13],
        datum[15],
        datum[16],
        datum[17],
        datum[18],
        datum[19]
      )
    })

    setSessions(newSessions)
  }

  const onProviderReportCleared = () => {
    setSessions([])
  }

  const onRunPayrollClicked = () => {
    if (contractors.length === 0 || sessions.length === 0) {
      alert("Cannot run payroll because not all of the data has been uploaded.")
    } else {
      const contractorHours = new PayrollCalculator(
        contractors,
        sessions
      ).calculate()

      var csvOutput: string =
        "contractor_type,first_name,last_name,ssn,business_name,ein,memo,hours_worked,wage,reimbursement,bonus,invoice_number\n"

      contractorHours.forEach((hours, contractor) => {
        const [firstName, lastName] = contractor.counselorName.split(" ")
        csvOutput += `${contractor.gustoType},${firstName},${lastName},${
          contractor.tin
        },${contractor.gustoBizName},${contractor.gustoFEIN},,${hours
          .totalHours()
          .toString()},,,,N/A\n`
      })
      downloadCsv(csvOutput, "payroll.csv")
    }
  }

  const downloadCsv = (dataStr: string, filename: string) => {
    const blob = new Blob([dataStr], { type: "text/csv" })
    const url = URL.createObjectURL(blob)

    const a = document.createElement("a")
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Grid container direction="column" alignItems="center">
        <UploadDataWidget
          prompt="Contractors"
          onDataLoaded={onUploadContractorsClicked}
          onDataCleared={onContractorsCleared}
        />
        <UploadDataWidget
          prompt="Provider Report"
          onDataLoaded={onUploadProviderReportClicked}
          onDataCleared={onProviderReportCleared}
        />
        <CustomButton onClick={onRunPayrollClicked}>Run Payroll</CustomButton>
      </Grid>
    </>
  )
}

export default PayrollPage
