// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import { useCSVReader } from "react-papaparse"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"

const CustomButton = styled.button`
  ${buttonStyles}
  width:250px;
`

type CsvLoaderProps = {
  buttonText: string
  onDataLoaded: (csvData: string[][]) => void
  onDataCleared: () => void
}

const CsvLoader: React.FC<CsvLoaderProps> = ({
  buttonText,
  onDataLoaded,
  onDataCleared,
}) => {
  const { CSVReader } = useCSVReader()
  const [data, setData] = useState<string[][]>([])

  useEffect(() => {
    if (data.length === 0) {
      onDataCleared()
    } else {
      onDataLoaded(data)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.length])

  return (
    <>
      <CSVReader
        onUploadAccepted={(results: any) => {
          setData(results.data)
        }}
      >
        {({
          getRootProps,
          acceptedFile,
          ProgressBar,
          getRemoveFileProps,
        }: any) => (
          <>
            <CustomButton {...getRootProps()}>{buttonText}</CustomButton>
            {data.length > 0 && (
              <>
                <CustomButton
                  {...getRemoveFileProps()}
                  onClick={() => setData([])}
                >
                  Remove
                </CustomButton>
              </>
            )}
            <ProgressBar />
          </>
        )}
      </CSVReader>
    </>
  )
}

export default CsvLoader
