// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"
import Contractor, { createContractor } from "../../data/Contractor"
import PayrollCalculator from "../../utils/PayrollCalculator"
import { handleUploadData } from "../../utils/DataProcessor"
import { downloadCsv } from "../../utils/CsvHelper"
import { PAYROLL_HEADERS, createPayrollLine } from "../../export/Payroll"
import { adaptTeleTeachersDataForPayroll } from "../../utils/TeleTeachersAdapter"
import {
  TRANSACTION_HEADERS,
  createTransactionLine,
} from "../../export/Transactions"
import { todaysDate } from "../../utils/DateUtils"
import HorizontalLine from "../widgets/HorizontalLine"
import {
  PAYROLL_SUMMARY_HEADERS,
  createPayrollSummaryLine,
} from "../../export/PayrollSummary"
import ProviderReportUploadWidget from "../data-widgets/ProviderReportUploadWidget"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultSubHeader from "../widgets/DefaultSubHeader"
import DefaultGridItem from "../widgets/DefaultGridItem"
import { SessionsContext } from "../../data/providers/SessionProvider"

const CustomButton = styled.button`
  ${buttonStyles}
  width:250px;
`

const PayrollPage: React.FC = () => {
  const [contractors, setContractors] = useState<Contractor[]>([])
  const { data: sessions } = useContext(SessionsContext)
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

  const processAndDownloadSummary = () => {
    const contractorHours = new PayrollCalculator(
      contractors,
      sessions
    ).calculate()

    var csvOutput: string = PAYROLL_SUMMARY_HEADERS

    contractorHours.forEach((hours, contractor) => {
      csvOutput += createPayrollSummaryLine(contractor, hours)
    })
    downloadCsv(csvOutput, "payroll-summary.csv")
  }

  useEffect(() => {
    if (sessions.length > 0 && contractors.length > 0) {
      setReadyToDownload(true)
    } else {
      setReadyToDownload(false)
    }
  }, [contractors.length, sessions.length])

  return (
    <>
      <Navbar />
      <DefaultHeader>Payroll</DefaultHeader>
      <DefaultGrid direction="column">
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
          <ProviderReportUploadWidget
            sessionDataAdapter={adaptTeleTeachersDataForPayroll}
          />
          <HorizontalLine />
        </>
        {readyToDownload && (
          <>
            <DefaultSubHeader>What would you like to do?</DefaultSubHeader>
            <DefaultGrid direction="row">
              <DefaultGridItem>
                <CustomButton onClick={() => processAndDownloadPayroll()}>
                  Download Payroll File
                </CustomButton>
              </DefaultGridItem>
              <DefaultGridItem>
                <CustomButton onClick={() => processAndDownloadTransactions()}>
                  Download Transactions File
                </CustomButton>
              </DefaultGridItem>
              <DefaultGridItem>
                <CustomButton onClick={() => processAndDownloadSummary()}>
                  Download Summary File
                </CustomButton>
              </DefaultGridItem>
            </DefaultGrid>
          </>
        )}
      </DefaultGrid>
    </>
  )
}

export default PayrollPage
