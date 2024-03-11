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

  const onUploadContractorsClicked = () => {
    const newContractors: Contractor[] = []
    newContractors.push(
      new Contractor("Jacek McGuinnness", "Individual", "*1234", "", "")
    )
    setContractors(newContractors)

    alert(JSON.stringify(newContractors))
  }

  const onUploadCustomersClicked = () => {
    const newCustomers: Customer[] = []
    newCustomers.push(
      new Customer(
        "Aardvark Academy",
        "Aardvark Academy",
        "someone@aardvark.com",
        "1234 Main St",
        "",
        "",
        "",
        "Phoenix",
        "Arizona",
        "12345",
        "USA",
        "120.0"
      )
    )
    setCustomers(newCustomers)

    alert(JSON.stringify(newCustomers))
  }

  const onUploadInvoiceParamsClicked = () => {
    const newInvoiceParams: InvoiceParams[] = []
    newInvoiceParams.push(
      new InvoiceParams(
        "Aardvark Academy",
        "INV-0302",
        "For services delivered in February 2024",
        "03/01/2024",
        "03/31/2024"
      )
    )
    setInvoiceParams(newInvoiceParams)

    alert(JSON.stringify(newInvoiceParams))
  }

  const onUploadProviderReportClicked = () => {
    const newSessions: Session[] = []
    newSessions.push(
      new Session(
        "Jacek McGuinnes",
        "Aardvark Academy",
        "Direct Service",
        "Mental Health Counseling",
        "Billy Joe",
        "Aardvark Academy",
        "Some notes.",
        "Present",
        "03/02/2024",
        "11:00 A.M.",
        "11:30 A.M.",
        "0",
        "30",
        "30"
      )
    )
    setSessions(newSessions)

    alert(JSON.stringify(newSessions))
  }

  const onRunPayrollClicked = () => {
    if (
      contractors.length === 0 ||
      customers.length === 0 ||
      sessions.length === 0
    ) {
      alert("Cannot run payroll because not all of the data has been uploaded.")
    } else {
      alert("Running Payroll...")
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
        callback={onUploadContractorsClicked}
      />
      <UploadDataWidget
        prompt="Customers"
        callback={onUploadCustomersClicked}
      />
      <UploadDataWidget
        prompt="Invoice Parameters"
        callback={onUploadInvoiceParamsClicked}
      />
      <UploadDataWidget
        prompt="Provider Report"
        callback={onUploadProviderReportClicked}
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
