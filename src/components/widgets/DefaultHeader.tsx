// Copyright 2022 Social Fabric, LLC

import { SxProps, Theme, Typography } from "@mui/material"
import React, { ReactNode } from "react"

type DefaultHeaderProps = {
  children: ReactNode
  props?: SxProps<Theme>
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({
  children,
  props = { mt: 5 },
}) => {
  return (
    <>
      <Typography variant="h4" sx={props}>
        {children}
      </Typography>
    </>
  )
}

export default DefaultHeader
