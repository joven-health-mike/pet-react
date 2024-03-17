// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import TransactionLineWidget from "./TransactionLineWidget"
import DefaultGrid from "./DefaultGrid"

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

  useEffect(() => {
    onDataChanged(data)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length])

  useEffect(() => {
    if (widgets.length > data.length) {
      const newData = [...data, ["", "", ""]]
      setData(newData)
    } else if (widgets.length < data.length) {
      const newData = [...data]
      newData.splice(data.length - 1)
      setData(newData)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [widgets.length])

  const onWidgetDataChanged = (index: number, datum: string[]) => {
    setData((oldData) => {
      const dataCopy = [...oldData]
      dataCopy[index] = datum
      onDataChanged(dataCopy)
      return dataCopy
    })
  }

  const expandWidget = () => {
    const index = widgets.length
    setWidgets([
      ...widgets,
      <TransactionLineWidget
        key={index}
        onDataChanged={(datum) => onWidgetDataChanged(index, datum)}
      />,
    ])
  }

  const contractWidget = () => {
    const widgetsCopy = [...widgets]
    widgetsCopy.splice(widgets.length - 1)
    setWidgets(widgetsCopy)
  }

  return (
    <>
      <DefaultGrid direction="column">
        {widgets}
        <CustomButton onClick={expandWidget}>+</CustomButton>
        <CustomButton onClick={contractWidget}>X</CustomButton>
      </DefaultGrid>
    </>
  )
}

export default TransactionLineList
