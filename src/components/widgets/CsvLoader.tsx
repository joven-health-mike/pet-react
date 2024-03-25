// Copyright 2022 Social Fabric, LLC

import React from "react"
import { useCSVReader } from "react-papaparse"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"

const CustomButton = styled.button`
  ${buttonStyles}
  width:250px;
`

type CsvLoaderProps = {
  buttonText: string
  csvData: string[][]
  setCsvData: (data: string[][]) => void
}

const CsvLoader: React.FC<CsvLoaderProps> = ({
  buttonText,
  csvData,
  setCsvData,
}) => {
  const { CSVReader } = useCSVReader()

  return (
    <>
      <CSVReader
        onUploadAccepted={(results: any) => {
          setCsvData(results.data)
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => {
          return (
            <>
              <CustomButton {...getRootProps()}>{buttonText}</CustomButton>
              {csvData && csvData.length > 0 && (
                <>
                  <CustomButton
                    {...getRemoveFileProps()}
                    onClick={() => setCsvData([])}
                  >
                    Remove
                  </CustomButton>
                </>
              )}
              <ProgressBar />
            </>
          )
        }}
      </CSVReader>
    </>
  )
}

export default CsvLoader
