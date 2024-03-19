// Copyright 2022 Social Fabric, LLC

import { SxProps, Theme, Typography } from "@mui/material"
import React, { ReactNode } from "react"

type DefaultSubHeaderProps = {
  children: ReactNode
  props?: SxProps<Theme>
}

const DefaultSubHeader: React.FC<DefaultSubHeaderProps> = ({
  children,
  props = { mt: 3 },
}) => {
  return (
    <>
      <Typography variant="h5" sx={props}>
        {children}
      </Typography>
    </>
  )
}

export default DefaultSubHeader
