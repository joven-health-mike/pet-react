// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { useCSVReader } from "react-papaparse"
import { buttonStyles } from "../styles/mixins"
import CheckIcon from "@mui/icons-material/Check"
import DefaultSubHeader from "./DefaultSubHeader"
import DefaultText from "./DefaultText"
import DefaultGrid from "./DefaultGrid"
import DefaultGridItem from "./DefaultGridItem"

const CustomButton = styled.button`
  ${buttonStyles}
  width:250px;
`

type UploadDataWidgetProps = {
  prompt: String
  subPrompt: String
  enableSecondOption?: boolean
  button1Text?: String
  button2Text?: String
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
  const { CSVReader } = useCSVReader()
  const [data, setData] = useState<string[]>([])
  const [data2, setData2] = useState<string[]>([])
  const [dataLoaded, setDataLoaded] = useState<boolean>(false)

  const onRemoveData = () => {
    setData([])
    onDataCleared()
  }

  const onRemoveData2 = () => {
    setData2([])
    if (onData2Cleared !== undefined) {
      onData2Cleared()
    }
  }

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
      {dataLoaded && <CheckIcon sx={{ color: "green", fontSize: "40px" }} />}
      <DefaultText>{subPrompt}</DefaultText>
      <DefaultGrid direction="row">
        <DefaultGridItem>
          <CSVReader
            onUploadAccepted={(results: any) => {
              setData(results.data)
              onDataLoaded(results.data)
            }}
          >
            {({
              getRootProps,
              acceptedFile,
              ProgressBar,
              getRemoveFileProps,
            }: any) => (
              <>
                <CustomButton {...getRootProps()}>{button1Text}</CustomButton>
                {data.length > 0 && (
                  <>
                    <CustomButton
                      {...getRemoveFileProps()}
                      onClick={onRemoveData}
                    >
                      Remove
                    </CustomButton>
                  </>
                )}
                <ProgressBar />
              </>
            )}
          </CSVReader>
        </DefaultGridItem>
        {enableSecondOption && (
          <DefaultGridItem>
            <CSVReader
              onUploadAccepted={(results: any) => {
                setData2(results.data)
                if (onData2Loaded !== undefined) {
                  onData2Loaded(results.data)
                }
              }}
            >
              {({
                getRootProps,
                acceptedFile,
                ProgressBar,
                getRemoveFileProps,
              }: any) => (
                <>
                  <CustomButton {...getRootProps()}>{button2Text}</CustomButton>
                  {data2.length > 0 && (
                    <>
                      <CustomButton
                        {...getRemoveFileProps()}
                        onClick={onRemoveData2}
                      >
                        Remove
                      </CustomButton>
                    </>
                  )}
                  <ProgressBar />
                </>
              )}
            </CSVReader>
          </DefaultGridItem>
        )}
      </DefaultGrid>
    </>
  )
}

export default UploadDataWidget
