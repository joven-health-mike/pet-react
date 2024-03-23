// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import DefaultSubHeader from "./DefaultSubHeader"
import DefaultText from "./DefaultText"
import DefaultGrid from "./DefaultGrid"
import DefaultGridItem from "./DefaultGridItem"
import CsvLoader from "./CsvLoader"
import GreenCheckMark from "../icons/GreenCheckMark"
import { buttonStyles } from "../styles/mixins"
import styled from "styled-components"

const CustomButton = styled.button`
  ${buttonStyles}
  width: 300px;
`

type UploadDataWidgetProps = {
  prompt: string
  subPrompt: string
  enableSecondOption?: boolean
  button1Text?: string
  button2Text?: string
  hasData?: boolean
  onDataLoaded: (data: string[][]) => void
  onDataCleared: () => void
  onData2Loaded?: (data: string[][]) => void
  onData2Cleared?: () => void
}

const UploadDataWidget: React.FC<UploadDataWidgetProps> = ({
  prompt,
  subPrompt,
  enableSecondOption,
  button1Text = "Upload",
  button2Text = "Upload",
  hasData = false,
  onDataLoaded,
  onDataCleared,
  onData2Loaded,
  onData2Cleared,
}) => {
  const [data, setData] = useState<string[][]>([])
  const [data2, setData2] = useState<string[][]>([])
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  const setAndSendData = (data: string[][]) => {
    setData(data)
    if (data.length > 0) {
      onDataLoaded(data)
      setDataLoaded(true)
    } else {
      onDataCleared()
      setDataLoaded(false)
    }
  }

  const setAndSendData2 = (data: string[][]) => {
    setData2(data)
    if (data.length > 0) {
      onData2Loaded && onData2Loaded(data)
      setDataLoaded(true)
    } else {
      onData2Cleared && onData2Cleared()
      setDataLoaded(false)
    }
  }

  return (
    <>
      <DefaultSubHeader>{prompt}</DefaultSubHeader>
      {(hasData || dataLoaded) && <GreenCheckMark />}
      <DefaultText>{subPrompt}</DefaultText>
      <DefaultGrid direction="row">
        <DefaultGridItem>
          <CsvLoader
            buttonText={button1Text}
            csvData={data}
            setCsvData={setAndSendData}
          />
        </DefaultGridItem>
        {enableSecondOption && (
          <DefaultGridItem>
            <CsvLoader
              buttonText={button2Text}
              csvData={data2}
              setCsvData={setAndSendData2}
            />
          </DefaultGridItem>
        )}
      </DefaultGrid>
      {(hasData || dataLoaded) && (
        <CustomButton
          onClick={() => {
            setAndSendData([])
            setAndSendData2([])
          }}
        >
          Clear All Data
        </CustomButton>
      )}
    </>
  )
}

export default UploadDataWidget
