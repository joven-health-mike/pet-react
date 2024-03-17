// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
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
import HorizontalLine from "../widgets/HorizontalLine"

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
      <Typography variant="h4" sx={{ mt: 5 }}>
        Transactions
      </Typography>
      <Grid container direction="column" alignItems="center">
        <TransactionLineList
          onDataChanged={(data: string[][]) => {
            setTransactions(data)
          }}
        />
        <HorizontalLine />
        {readyToDownload && (
          <Grid container direction={"row"} alignItems={"center"} sx={{ p: 1 }}>
            <Grid
              item
              xs={true}
              sm={true}
              md={true}
              lg={true}
              xl={true}
              sx={{ p: 1 }}
            >
              <CustomButton onClick={onRunTransactionsClicked}>
                Run Transactions
              </CustomButton>
            </Grid>
          </Grid>
        )}
      </Grid>
    </>
  )
}

export default TransactionsPage
