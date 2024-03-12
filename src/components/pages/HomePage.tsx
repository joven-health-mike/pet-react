// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Button, Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor from "../../data/Contractor"
import Customer from "../../data/Customer"
import InvoiceParams from "../../data/InvoiceParams"
import Session from "../../data/Session"
import PayrollCalculator from "../../utils/PayrollCalculator"

const CustomButton = styled.a`
  ${buttonStyles}
`

const HomePage: React.FC = () => {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <AdminView />
    </>
  )
}

const AdminView: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [invoiceParams, setInvoiceParams] = useState<InvoiceParams[]>([])
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

  const onUploadCustomersClicked = (data: string[][]) => {
    const newCustomers: Customer[] = data.slice(1).map((datum) => {
      return new Customer(
        datum[0],
        datum[1],
        datum[2],
        datum[3],
        datum[4],
        datum[5],
        datum[6],
        datum[7],
        datum[8],
        datum[9],
        datum[10],
        datum[11]
      )
    })

    setCustomers(newCustomers)
  }

  const onCustomersCleared = () => {
    setCustomers([])
    console.log("customers cleared")
  }

  const onUploadInvoiceParamsClicked = (data: string[][]) => {
    const newInvoiceParams: InvoiceParams[] = data.slice(1).map((datum) => {
      return new InvoiceParams(datum[0], datum[1], datum[2], datum[3], datum[4])
    })

    setInvoiceParams(newInvoiceParams)
  }

  const onInvoiceParamsCleared = () => {
    setInvoiceParams([])
  }

  const onUploadProviderReportClicked = (data: string[][]) => {
    console.log(data[0])

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

    console.log(newSessions)

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

      contractorHours.forEach((hours, name) => {
        console.log(`Key: ${name}, Total Hours: ${hours.totalHours()}`)
      })
    }
  }

  const onRunInvoicesClicked = () => {
    if (
      contractors.length === 0 ||
      customers.length === 0 ||
      invoiceParams.length === 0 ||
      sessions.length === 0
    ) {
      alert(
        "Cannot run invoices because not all of the data has been uploaded."
      )
    } else {
      alert("Running Invoices...")
    }
  }

  return (
    <Grid container direction="column" alignItems="center">
      <UploadDataWidget
        prompt="Contractors"
        onDataLoaded={onUploadContractorsClicked}
        onDataCleared={onContractorsCleared}
      />
      <UploadDataWidget
        prompt="Customers"
        onDataLoaded={onUploadCustomersClicked}
        onDataCleared={onCustomersCleared}
      />
      <UploadDataWidget
        prompt="Invoice Parameters"
        onDataLoaded={onUploadInvoiceParamsClicked}
        onDataCleared={onInvoiceParamsCleared}
      />
      <UploadDataWidget
        prompt="Provider Report"
        onDataLoaded={onUploadProviderReportClicked}
        onDataCleared={onProviderReportCleared}
      />
      <CustomButton>
        <Button onClick={onRunPayrollClicked}>Run Payroll</Button>
      </CustomButton>
      <CustomButton>
        <Button onClick={onRunInvoicesClicked}>Run Invoices</Button>
      </CustomButton>
    </Grid>
  )
}

export default HomePage
