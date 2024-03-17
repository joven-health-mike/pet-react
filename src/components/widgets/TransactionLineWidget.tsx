// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import DefaultGrid from "./DefaultGrid"
import InputText from "./InputText"

type TransactionLineWidgetProps = {
  initialData?: string[]
  onDataChanged: (data: string[]) => void
}

const TransactionLineWidget: React.FC<TransactionLineWidgetProps> = ({
  initialData = ["", "", ""],
  onDataChanged,
}) => {
  const [date, setDate] = useState<string>(initialData[0])
  const [amount, setAmount] = useState<string>(initialData[1])
  const [payee, setPayee] = useState<string>(initialData[2])

  useEffect(() => {
    onDataChanged([date, amount, payee])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [date.length, amount.length, payee.length])

  return (
    <>
      <DefaultGrid direction="row">
        <InputText
          name="date"
          prompt="Date"
          onTextChanged={(text) => setDate(text)}
        />
        <InputText
          name="amount"
          prompt="Amount"
          onTextChanged={(text) => setAmount(text)}
        />
        <InputText
          name="payee"
          prompt="Payee"
          onTextChanged={(text) => setPayee(text)}
        />
      </DefaultGrid>
    </>
  )
}

export default TransactionLineWidget
