// Copyright 2022 Social Fabric, LLC

import { Typography } from "@mui/material"
import React, { ReactNode } from "react"

type DefaultTextProps = {
  children: ReactNode
}

const DefaultText: React.FC<DefaultTextProps> = ({ children }) => {
  return (
    <>
      <Typography sx={{ mt: 1, mb: 3, mr: 3 }}>{children}</Typography>
    </>
  )
}

export default DefaultText
