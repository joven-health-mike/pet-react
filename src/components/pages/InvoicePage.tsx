// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor from "../../data/Contractor"
import Customer from "../../data/Customer"
import InvoiceParams from "../../data/InvoiceParams"
import Session from "../../data/Session"
import AccountingCode from "../../data/AccountingCode"
import InvoiceCalculator from "../../utils/InvoiceCalculator"

const CustomButton = styled.button`
  ${buttonStyles}
`

const InvoicePage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [invoiceParams, setInvoiceParams] = useState<InvoiceParams[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [accountingCodes, setAccountingCodes] = useState<AccountingCode[]>([])

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

  const onUploadAccountingCodesClicked = (data: string[][]) => {
    const newAccountingCodes: AccountingCode[] = data.slice(1).map((datum) => {
      return new AccountingCode(datum[0], datum[1])
    })

    setAccountingCodes(newAccountingCodes)
  }

  const onAccountingCodesCleared = () => {
    setAccountingCodes([])
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
      const customerSessionInfos = new InvoiceCalculator(
        accountingCodes,
        contractors,
        customers,
        invoiceParams,
        sessions
      ).calculate()

      var csvOutput: string =
        "ContactName,EmailAddress,POAddressLine1,POAddressLine2,POAddressLine3,POAddressLine4,POCity,PORegion,POPostalCode,POCountry,SAAddressLine1,SAAddressLine2,SAAddressLine3,SAAddressLine4,SACity,SARegion,SAPostalCode,SACountry,InvoiceNumber,Reference,InvoiceDate,DueDate,PlannedDate,Total,TaxTotal,InvoiceAmountPaid,InvoiceAmountDue,InventoryItemCode,Description,Quantity,UnitAmount,Discount,LineAmount,AccountCode,TaxType,TaxAmount,TrackingName1,TrackingOption1,TrackingName2,TrackingOption2,Currency,Type,Sent,Status\n"

      customerSessionInfos.forEach((sessionInfos, customer) => {
        var invoiceTotal = 0
        sessionInfos.forEach((sessionInfo) => {
          invoiceTotal += parseFloat(sessionInfo.lineAmount)
        })
        const invoiceTotalStr = invoiceTotal.toFixed(2)
        sessionInfos.forEach((sessionInfo) => {
          csvOutput += `${customer.xeroName},${customer.email},${customer.address1},${customer.address2},${customer.address3},${customer.address4},${customer.city},${customer.state},${customer.zip},${customer.country},${customer.address1},${customer.address2},${customer.address3},${customer.address4},${customer.city},${customer.state},${customer.zip},${customer.country},${sessionInfo.lineInvoiceParams.invoiceNumber},${sessionInfo.lineInvoiceParams.reference},${sessionInfo.lineInvoiceParams.invoiceDate},${sessionInfo.lineInvoiceParams.dueDate},,${invoiceTotalStr},0,0,${invoiceTotalStr},,${sessionInfo.lineDescription},${sessionInfo.lineQuantity},${sessionInfo.lineRate},,${sessionInfo.lineAmount},${sessionInfo.lineAccountCode},Tax Exempt,,,,,,USD,Sales Invoice,,Draft\n`
        })
      })
      downloadCsv(csvOutput, "invoices.csv")
    }
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Grid container direction="column" alignItems="center">
        <UploadDataWidget
          prompt="Accounting Codes"
          onDataLoaded={onUploadAccountingCodesClicked}
          onDataCleared={onAccountingCodesCleared}
        />
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

        <CustomButton onClick={onRunInvoicesClicked}>Run Invoices</CustomButton>
      </Grid>
    </>
  )
}

export default InvoicePage
