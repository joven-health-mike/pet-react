// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor, { createContractor } from "../../data/Contractor"
import Customer, { createCustomer } from "../../data/Customer"
import InvoiceParams, { createInvoiceParams } from "../../data/InvoiceParams"
import Session, { createSession } from "../../data/Session"
import AccountingCode, { createAccountingCode } from "../../data/AccountingCode"
import InvoiceCalculator from "../../utils/InvoiceCalculator"
import { handleUploadData } from "../../utils/DataProcessor"
import { downloadCsv } from "../../utils/CsvHelper"
import { INVOICE_HEADERS, createInvoiceLine } from "../../outputs/Invoices"
import { adaptTeleTeachersDataForInvoices } from "../../utils/TeleTeachersAdapter"

const CustomButton = styled.button`
  ${buttonStyles}
`

const InvoicePage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [invoiceParams, setInvoiceParams] = useState<InvoiceParams[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [accountingCodes, setAccountingCodes] = useState<AccountingCode[]>([])

  const readyToRunInvoices = () => {
    return (
      accountingCodes.length === 0 ||
      contractors.length === 0 ||
      customers.length === 0 ||
      invoiceParams.length === 0 ||
      sessions.length === 0
    )
  }

  const onRunInvoicesClicked = () => {
    if (readyToRunInvoices()) {
      alert(
        "Cannot run invoices because not all of the data has been uploaded."
      )
    } else {
      processAndDownloadInvoices()
    }
  }

  const processAndDownloadInvoices = () => {
    const customerSessionInfos = new InvoiceCalculator(
      accountingCodes,
      contractors,
      customers,
      invoiceParams,
      sessions
    ).calculate()

    var csvOutput: string = INVOICE_HEADERS

    customerSessionInfos.forEach((sessionInfos, customer) => {
      var invoiceTotal = 0
      sessionInfos.forEach((sessionInfo) => {
        invoiceTotal += parseFloat(sessionInfo.lineAmount)
      })
      const invoiceTotalStr = invoiceTotal.toFixed(2)
      sessionInfos.forEach((sessionInfo) => {
        csvOutput += createInvoiceLine(customer, sessionInfo, invoiceTotalStr)
      })
    })
    downloadCsv(csvOutput, "invoices.csv")
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Invoices
      </Typography>
      <Grid container direction="column" alignItems="center">
        <UploadDataWidget
          prompt="Accounting Codes"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setAccountingCodes, createAccountingCode)
          }
          onDataCleared={() => setAccountingCodes([])}
        />
        <UploadDataWidget
          prompt="Contractors"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setContractors, createContractor)
          }
          onDataCleared={() => setContractors([])}
        />
        <UploadDataWidget
          prompt="Customers"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setCustomers, createCustomer)
          }
          onDataCleared={() => setCustomers([])}
        />
        <UploadDataWidget
          prompt="Invoice Parameters"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setInvoiceParams, createInvoiceParams)
          }
          onDataCleared={() => setInvoiceParams([])}
        />
        <UploadDataWidget
          prompt="Provider Report"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(data, setSessions, createSession)
          }
          onDataCleared={() => setSessions([])}
        />
        <UploadDataWidget
          prompt="Provider Report (TeleTeachers)"
          onDataLoaded={(data: string[][]) =>
            handleUploadData(
              adaptTeleTeachersDataForInvoices(data),
              setSessions,
              createSession
            )
          }
          onDataCleared={() => setSessions([])}
        />

        <CustomButton onClick={onRunInvoicesClicked}>Run Invoices</CustomButton>
      </Grid>
    </>
  )
}

export default InvoicePage
