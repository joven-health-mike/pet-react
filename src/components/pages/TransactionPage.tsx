// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import { downloadCsv } from "../../utils/CsvHelper"
import { HEADERS, createTransactionLine } from "../../outputs/Transactions"
import TransactionLineWidget from "../widgets/TransactionLineWidget"

const CustomButton = styled.button`
  ${buttonStyles}
`

const TransactionsPage: React.FC = () => {
  const [rowIndex, setRowIndex] = useState<number>(0)
  const [transactions, setTransactions] = useState<string[][]>([])

  const onRunTransactionsClicked = () => {
    processAndDownloadTransactions()
  }

  const processAndDownloadTransactions = () => {
    var csvOutput: string = HEADERS

    transactions.forEach((inputs) => {
      csvOutput += createTransactionLine(inputs)
    })
    downloadCsv(csvOutput, "transactions.csv")
  }

  const onTransactionLoaded = (data: string[], index: number) => {
    if (index < rowIndex) {
      const transactionsCopy = [...transactions]
      transactionsCopy[index] = data
      setTransactions(transactionsCopy)
    } else {
      setTransactions([...transactions, data])
      setRowIndex(rowIndex + 1)
    }
  }

  const onTransactionCleared = (index: number) => {
    const transactionsCopy = [...transactions]
    transactionsCopy.splice(index, 1)
    setTransactions(transactionsCopy)
    setRowIndex(Math.max(rowIndex - 1, 0))
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Grid container direction="row">
        {transactions.map((transaction, index) => {
          return (
            <TransactionLineWidget
              key={index}
              index={index}
              initialData={transaction}
              onDataLoaded={onTransactionLoaded}
              onDataCleared={onTransactionCleared}
            ></TransactionLineWidget>
          )
        })}
        <TransactionLineWidget
          key={rowIndex}
          index={rowIndex}
          initialData={["", "", ""]}
          onDataLoaded={onTransactionLoaded}
          onDataCleared={onTransactionCleared}
        ></TransactionLineWidget>
        <CustomButton onClick={onRunTransactionsClicked}>
          Run Transactions
        </CustomButton>
      </Grid>
    </>
  )
}

export default TransactionsPage
