// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import { Grid } from "@mui/material"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import TransactionLineWidget from "./TransactionLineWidget"

const CustomButton = styled.button`
  ${buttonStyles}
`

type TransactionLineListProps = {
  onDataChanged: (data: string[][]) => void
}

const TransactionLineList: React.FC<TransactionLineListProps> = ({
  onDataChanged,
}) => {
  const [widgets, setWidgets] = useState<React.JSX.Element[]>([])
  const [data, setData] = useState<string[][]>([])

  const updateLines = (oldSize: number, newSize: number) => {
    if (oldSize === newSize) {
      return
    }
    // Generate JSX objects using map()
    const newWidgets = Array.from({ length: newSize }, (_, index) => {
      let initialData = ["", "", ""]

      if (index < oldSize) {
        initialData = data[index]
      }

      onWidgetDataChanged(index, initialData)

      return (
        <TransactionLineWidget
          key={index}
          initialData={initialData}
          onDataChanged={(data) => onWidgetDataChanged(index, data)}
        />
      )
    })

    setWidgets(newWidgets)
  }

  const onWidgetDataChanged = (index: number, datum: string[]) => {
    const dataCopy = [...data]
    dataCopy[index] = datum
    setData(dataCopy)
    onDataChanged(dataCopy)
  }

  const expandData = () => {
    updateLines(widgets.length, widgets.length + 1)
  }

  const contractData = () => {
    updateLines(widgets.length, widgets.length - 1)
  }

  return (
    <>
      <Grid container direction="column" alignItems="center">
        {widgets}
        <CustomButton onClick={expandData}>+</CustomButton>
        <CustomButton onClick={contractData}>X</CustomButton>
      </Grid>
    </>
  )
}

export default TransactionLineList
