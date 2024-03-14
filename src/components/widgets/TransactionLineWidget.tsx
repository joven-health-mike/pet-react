// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import { FormControl, Grid, Input, InputLabel } from "@mui/material"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"

const CustomButton = styled.button`
  ${buttonStyles}
`

type TransactionLineWidgetProps = {
  index: number
  initialData: string[]
  onDataLoaded: (data: string[], index: number) => void
  onDataCleared: (index: number) => void
}

const TransactionLineWidget: React.FC<TransactionLineWidgetProps> = ({
  index,
  initialData,
  onDataLoaded,
  onDataCleared,
}) => {
  const [data, setData] = useState<string[]>(initialData)

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
          <InputLabel id="date">Date</InputLabel>
          <Input
            id="date"
            value={data[0]}
            onChange={(e) => {
              setData([e.target.value, data[1], data[2]])
            }}
          />
        </FormControl>
        <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
          <InputLabel id="amount">Amount</InputLabel>
          <Input
            id="amount"
            value={data[1]}
            onChange={(e) => {
              setData([data[0], e.target.value, data[2]])
            }}
          />
        </FormControl>
        <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
          <InputLabel id="payee">Payee</InputLabel>
          <Input
            id="payee"
            value={data[2]}
            onChange={(e) => {
              setData([data[0], data[1], e.target.value])
            }}
          />
        </FormControl>
        <CustomButton
          onClick={() => {
            if (data[0] !== "" && data[1] !== "" && data[2] !== "") {
              onDataLoaded(data, index)
            } else {
              alert("Please fill out all data for this row.")
            }
          }}
        >
          +
        </CustomButton>
        <CustomButton
          onClick={() => {
            setData(["", "", ""])
            onDataCleared(index)
          }}
        >
          X
        </CustomButton>
      </Grid>
    </>
  )
}

export default TransactionLineWidget
