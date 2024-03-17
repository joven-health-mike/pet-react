// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
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
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import DefaultSubHeader from "../widgets/DefaultSubHeader"

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
      <Navbar />
      <DefaultHeader>Invoices</DefaultHeader>
      <DefaultGrid direction="column">
        <DefaultGrid direction="row">
          <DefaultGridItem>
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
          </DefaultGridItem>
          <DefaultGridItem>
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
          </DefaultGridItem>
        </DefaultGrid>
        <HorizontalLine />
        <DefaultGrid direction="row">
          <DefaultGridItem>
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
          </DefaultGridItem>
          <DefaultGridItem>
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
          </DefaultGridItem>
        </DefaultGrid>
        <HorizontalLine />
        <DefaultGrid direction="row">
          <DefaultGridItem>
            <ProviderReportUploadWidget
              onSessionsLoaded={(sessions: Session[]) => {
                setSessions(sessions)
              }}
              onSessionsCleared={() => {
                setSessions([])
              }}
              sessionFactory={createSession}
              sessionDataAdapter={adaptTeleTeachersDataForInvoices}
            />
          </DefaultGridItem>
        </DefaultGrid>
        <HorizontalLine />
        {readyToDownload && (
          <DefaultGrid direction="column">
            <DefaultSubHeader>What would you like to do?</DefaultSubHeader>
            <DefaultGrid direction="row">
              <DefaultGridItem>
                <CustomButton onClick={() => processAndDownloadInvoices()}>
                  Download Invoices File
                </CustomButton>
              </DefaultGridItem>
              <DefaultGridItem>
                <CustomButton onClick={() => processAndDownloadSummary()}>
                  Download Summary
                </CustomButton>
              </DefaultGridItem>
            </DefaultGrid>
          </DefaultGrid>
        )}
      </DefaultGrid>
    </>
  )
}

export default InvoicePage
