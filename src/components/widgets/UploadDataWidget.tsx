// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import DefaultSubHeader from "./DefaultSubHeader"
import DefaultText from "./DefaultText"
import DefaultGrid from "./DefaultGrid"
import DefaultGridItem from "./DefaultGridItem"
import CsvLoader from "./CsvLoader"
import GreenCheckMark from "../Icons/GreenCheckMark"

type UploadDataWidgetProps = {
  prompt: string
  subPrompt: string
  enableSecondOption?: boolean
  button1Text?: string
  button2Text?: string
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
  onDataLoaded,
  onDataCleared,
  onData2Loaded,
  onData2Cleared,
}) => {
  const [data, setData] = useState<string[][]>([])
  const [data2, setData2] = useState<string[][]>([])
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  useEffect(() => {
    if (data.length === 0) {
      onDataCleared()
    } else {
      onDataLoaded(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length])

  useEffect(() => {
    if (data2.length === 0) {
      if (onData2Cleared !== undefined) {
        onData2Cleared()
      }
    } else {
      if (onData2Loaded !== undefined) {
        onData2Loaded(data2)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data2.length])

  useEffect(() => {
    if (data.length > 0 || data2.length > 0) {
      setDataLoaded(true)
    } else {
      setDataLoaded(false)
    }
  }, [data.length, data2.length])

  return (
    <>
      <DefaultSubHeader>{prompt}</DefaultSubHeader>
      {dataLoaded && <GreenCheckMark />}
      <DefaultText>{subPrompt}</DefaultText>
      <DefaultGrid direction="row">
        <DefaultGridItem>
          <CsvLoader
            buttonText={button1Text}
            onDataLoaded={(data: string[][]) => {
              setData(data)
            }}
            onDataCleared={() => setData([])}
          />
        </DefaultGridItem>
        {enableSecondOption && (
          <DefaultGridItem>
            <CsvLoader
              buttonText={button2Text}
              onDataLoaded={(data: string[][]) => {
                setData2(data)
              }}
              onDataCleared={() => setData2([])}
            />
          </DefaultGridItem>
        )}
      </DefaultGrid>
    </>
  )
}

export default UploadDataWidget
