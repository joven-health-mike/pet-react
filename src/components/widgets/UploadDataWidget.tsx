// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { useCSVReader } from "react-papaparse"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"

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

  return (
    <>
      <Typography variant="h5" sx={{ mt: 3 }}>
        {prompt}
      </Typography>
      <Typography sx={{ mt: 1, mb: 3 }}>{subPrompt}</Typography>
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
                  <CustomButton
                    {...getRemoveFileProps()}
                    onClick={onRemoveData}
                  >
                    Remove
                  </CustomButton>
                )}
                <ProgressBar />
              </>
            )}
          </CSVReader>
        </Grid>
        {enableSecondOption && (
          <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
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
                    <CustomButton
                      {...getRemoveFileProps()}
                      onClick={onRemoveData2}
                    >
                      Remove
                    </CustomButton>
                  )}
                  <ProgressBar />
                </>
              )}
            </CSVReader>
          </Grid>
        )}
      </Grid>
      <div
        style={{
          borderBottom: "0.1em solid black",
          padding: "0.5em",
          minWidth: "100%",
        }}
      ></div>
    </>
  )
}

export default UploadDataWidget
