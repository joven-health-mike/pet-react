// Copyright 2022 Social Fabric, LLC

import { Typography } from "@mui/material"
import React, { ReactNode } from "react"

type DefaultSubHeaderProps = {
  children: ReactNode
}

const DefaultSubHeader: React.FC<DefaultSubHeaderProps> = ({ children }) => {
  return (
    <>
      <Typography variant="h5" sx={{ mt: 3 }}>
        {children}
      </Typography>
    </>
  )
}

export default DefaultSubHeader
