// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
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
import HorizontalLine from "../widgets/HorizontalLine"
import {
  INVOICE_SUMMARY_HEADERS,
  createInvoiceSummaryLine,
} from "../../outputs/InvoiceSummary"

const CustomButton = styled.button`
  ${buttonStyles}
`

const InvoicePage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const [customers, setCustomers] = useState<Customer[]>([])
  const [invoiceParams, setInvoiceParams] = useState<InvoiceParams[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [accountingCodes, setAccountingCodes] = useState<AccountingCode[]>([])
  const [readyToDownload, setReadyToDownload] = useState<boolean>(false)

  useEffect(() => {
    if (
      accountingCodes.length > 0 &&
      contractors.length > 0 &&
      customers.length > 0 &&
      invoiceParams.length > 0 &&
      sessions.length > 0
    ) {
      setReadyToDownload(true)
    } else {
      setReadyToDownload(false)
    }
  }, [
    accountingCodes.length,
    contractors.length,
    customers.length,
    invoiceParams.length,
    sessions.length,
  ])

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

  const processAndDownloadSummary = () => {
    const customerSessionInfos = new InvoiceCalculator(
      accountingCodes,
      contractors,
      customers,
      invoiceParams,
      sessions
    ).calculate()

    let csvOutput: string = INVOICE_SUMMARY_HEADERS
    const customerMap: Map<Customer, number[]> = new Map()

    customerSessionInfos.forEach((sessionInfos, customer) => {
      if (!customerMap.has(customer)) {
        customerMap.set(customer, [0, 0])
      }
      let invoiceTotal = 0
      let invoiceTotalHours = 0
      sessionInfos.forEach((sessionInfo) => {
        invoiceTotal += parseFloat(sessionInfo.lineAmount)
        invoiceTotalHours += parseFloat(sessionInfo.lineQuantity)
      })
      const oldInvoiceTotal = customerMap.get(customer)![0]
      const oldInvoiceTotalHours = customerMap.get(customer)![1]
      customerMap.set(customer, [
        oldInvoiceTotal + invoiceTotal,
        oldInvoiceTotalHours + invoiceTotalHours,
      ])
    })

    const customerArray = Array.from(customerMap)
    customerArray.sort((a, b) => {
      const aValue = a[1][1] // Second element of value array of 'a'
      const bValue = b[1][1] // Second element of value array of 'b'

      // Sort in descending order
      return bValue - aValue
    })

    customerArray.forEach(([customer, values]) => {
      if (!customerMap.has(customer)) return
      csvOutput += createInvoiceSummaryLine(
        customer,
        values[0].toFixed(2),
        values[1].toFixed(3)
      )
    })

    downloadCsv(csvOutput, "invoice-summary.csv")
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
        <Grid container direction="row" alignItems="center">
          <Grid
            item
            xs={true}
            sm={true}
            md={true}
            lg={true}
            xl={true}
            sx={{ p: 1 }}
          >
            <UploadDataWidget
              prompt="Accounting Codes"
              subPrompt="Data for accounting codes can be found in the **PET Program Inputs** sheet."
              onDataLoaded={(data: string[][]) =>
                handleUploadData(data, setAccountingCodes, createAccountingCode)
              }
              onDataCleared={() => {
                setAccountingCodes([])
                setReadyToDownload(false)
              }}
            />
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
            <UploadDataWidget
              prompt="Contractors"
              subPrompt="Data for contractors can be found in the **PET Program Inputs** sheet."
              onDataLoaded={(data: string[][]) =>
                handleUploadData(data, setContractors, createContractor)
              }
              onDataCleared={() => {
                setContractors([])
                setReadyToDownload(false)
              }}
            />
          </Grid>
        </Grid>
        <HorizontalLine />
        <Grid container direction="row" alignItems="center">
          <Grid
            item
            xs={true}
            sm={true}
            md={true}
            lg={true}
            xl={true}
            sx={{ p: 1 }}
          >
            <UploadDataWidget
              prompt="Customers"
              subPrompt="Data for customers can be found in the **PET Program Inputs** sheet."
              onDataLoaded={(data: string[][]) =>
                handleUploadData(data, setCustomers, createCustomer)
              }
              onDataCleared={() => {
                setCustomers([])
                setReadyToDownload(false)
              }}
            />
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
            <UploadDataWidget
              prompt="Invoice Parameters"
              subPrompt="Data for invoice parameters can be found in the **PET Program Inputs** sheet."
              onDataLoaded={(data: string[][]) =>
                handleUploadData(data, setInvoiceParams, createInvoiceParams)
              }
              onDataCleared={() => {
                setInvoiceParams([])
                setReadyToDownload(false)
              }}
            />
          </Grid>
        </Grid>
        <HorizontalLine />
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
                adaptTeleTeachersDataForInvoices(data),
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
                <CustomButton onClick={() => processAndDownloadInvoices()}>
                  Download Invoices File
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
                <CustomButton onClick={() => processAndDownloadSummary()}>
                  Download Summary
                </CustomButton>
              </Grid>
            </Grid>
          </>
        )}
      </Grid>
    </>
  )
}

export default InvoicePage
