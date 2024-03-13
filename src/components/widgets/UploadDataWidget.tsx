// Copyright 2022 Social Fabric, LLC

import React, { useState } from "react"
import styled from "styled-components"
import { useCSVReader } from "react-papaparse"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"

const CustomButton = styled.button`
  ${buttonStyles}
`

type UploadDataWidgetProps = {
  prompt: String
  onDataLoaded: (data: string[][]) => void
  onDataCleared: () => void
}

const UploadDataWidget: React.FC<UploadDataWidgetProps> = ({
  prompt,
  onDataLoaded,
  onDataCleared,
}) => {
  const { CSVReader } = useCSVReader()
  const [data, setData] = useState<string[]>([])

  const onRemoveData = () => {
    setData([])
    onDataCleared()
  }

  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Typography>{prompt}</Typography>
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
              <CustomButton {...getRootProps()}>Upload</CustomButton>
              {data.length > 0 && (
                <CustomButton {...getRemoveFileProps()} onClick={onRemoveData}>
                  Remove
                </CustomButton>
              )}
              <ProgressBar />
            </>
          )}
        </CSVReader>
      </Grid>
    </>
  )
}

export default UploadDataWidget
