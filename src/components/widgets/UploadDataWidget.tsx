// Copyright 2022 Social Fabric, LLC

import React from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Button, Grid, Typography } from "@mui/material"

const CustomButton = styled.a`
  ${buttonStyles}
`

type UploadDataWidgetProps = {
  prompt: String
  callback: React.MouseEventHandler<HTMLButtonElement> | undefined
}

const UploadDataWidget: React.FC<UploadDataWidgetProps> = ({
  prompt,
  callback,
}) => {
  return (
    <>
      <Grid container direction="row" alignItems="center">
        <Typography>{prompt}</Typography>
        <CustomButton>
          <Button onClick={callback}>{"Upload File"}</Button>
        </CustomButton>
      </Grid>
    </>
  )
}

export default UploadDataWidget
