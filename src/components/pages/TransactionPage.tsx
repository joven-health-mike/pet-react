// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"
import Navbar from "../navbar/Navbar"
import { downloadCsv } from "../../utils/CsvHelper"
import {
  TRANSACTION_HEADERS,
  createTransactionLine,
} from "../../outputs/Transactions"
import TransactionLineList from "../widgets/TransactionLineList"

const CustomButton = styled.button`
  ${buttonStyles}
`

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<string[][]>([])

  const onRunTransactionsClicked = () => {
    processAndDownloadTransactions()
  }

  const processAndDownloadTransactions = () => {
    var csvOutput: string = TRANSACTION_HEADERS

    transactions.forEach((inputs) => {
      csvOutput += createTransactionLine(inputs)
    })
    downloadCsv(csvOutput, "transactions.csv")
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Transactions
      </Typography>
      <Grid container direction="column" alignItems="center">
        <TransactionLineList
          onDataChanged={(data: string[][]) => {
            console.log(`onDataChanged: ${data.toString()}`)
            setTransactions(data)
          }}
        />
        <CustomButton onClick={onRunTransactionsClicked}>
          Run Transactions
        </CustomButton>
      </Grid>
    </>
  )
}

export default TransactionsPage
