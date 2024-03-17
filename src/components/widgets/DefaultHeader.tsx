// Copyright 2022 Social Fabric, LLC

import { Typography } from "@mui/material"
import React, { ReactNode } from "react"

type DefaultHeaderProps = {
  children: ReactNode
}

const DefaultHeader: React.FC<DefaultHeaderProps> = ({ children }) => {
  return (
    <>
      <Typography variant="h4" sx={{ mt: 5 }}>
        {children}
      </Typography>
    </>
  )
}

export default DefaultHeader
