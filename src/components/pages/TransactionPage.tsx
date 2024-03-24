// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import Navbar from "../navbar/Navbar"
import { downloadCsv } from "../../utils/CsvHelper"
import {
  TRANSACTION_HEADERS,
  createTransactionLine,
} from "../../export/Transactions"
import TransactionLineList from "../widgets/TransactionLineList"
import HorizontalLine from "../widgets/HorizontalLine"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"

const CustomButton = styled.button`
  ${buttonStyles}
`

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<string[][]>([])
  const [readyToDownload, setReadyToDownload] = useState<boolean>(false)

  const onRunTransactionsClicked = () => {
    processAndDownloadTransactions()
  }

  const processAndDownloadTransactions = () => {
    var csvOutput: string = TRANSACTION_HEADERS

    transactions.forEach((inputs) => {
      let hasFullData = true
      for (let i = 0; i < inputs.length; i++) {
        if (inputs[i] === "") {
          hasFullData = false
        }
      }
      if (hasFullData) {
        csvOutput += createTransactionLine(inputs)
      }
    })
    downloadCsv(csvOutput, "transactions.csv")
  }

  useEffect(() => {
    if (transactions.length > 0) {
      setReadyToDownload(true)
    } else {
      setReadyToDownload(false)
    }
  }, [transactions.length])

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <DefaultHeader>Transactions</DefaultHeader>
      <DefaultGrid direction="column">
        <>
          <TransactionLineList
            onDataChanged={(data: string[][]) => {
              setTransactions(data)
            }}
          />
          <HorizontalLine />
        </>
        {readyToDownload && (
          <DefaultGrid>
            <DefaultGridItem>
              <CustomButton onClick={onRunTransactionsClicked}>
                Run Transactions
              </CustomButton>
            </DefaultGridItem>
          </DefaultGrid>
        )}
      </DefaultGrid>
    </>
  )
}

export default TransactionsPage
