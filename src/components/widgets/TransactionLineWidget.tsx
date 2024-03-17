// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import { FormControl, Input, InputLabel } from "@mui/material"
import DefaultGrid from "./DefaultGrid"

type TransactionLineWidgetProps = {
  initialData: string[]
  onDataChanged: (data: string[]) => void
}

const TransactionLineWidget: React.FC<TransactionLineWidgetProps> = ({
  initialData,
  onDataChanged,
}) => {
  const [date, setDate] = useState<string>(initialData[0])
  const [amount, setAmount] = useState<string>(initialData[1])
  const [payee, setPayee] = useState<string>(initialData[2])

  return (
    <>
      <DefaultGrid direction="row">
        <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
          <InputLabel id="date">Date</InputLabel>
          <Input
            id="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value)
              onDataChanged([e.target.value, amount, payee])
            }}
          />
        </FormControl>
        <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
          <InputLabel id="amount">Amount</InputLabel>
          <Input
            id="amount"
            value={amount}
            onChange={(e) => {
              setAmount(e.target.value)
              onDataChanged([date, e.target.value, payee])
            }}
          />
        </FormControl>
        <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
          <InputLabel id="payee">Payee</InputLabel>
          <Input
            id="payee"
            value={payee}
            onChange={(e) => {
              setPayee(e.target.value)
              onDataChanged([date, amount, e.target.value])
            }}
          />
        </FormControl>
      </DefaultGrid>
    </>
  )
}

export default TransactionLineWidget
