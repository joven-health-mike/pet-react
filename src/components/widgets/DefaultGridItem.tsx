// Copyright 2022 Social Fabric, LLC

import { Grid } from "@mui/material"
import React, { ReactNode } from "react"

type DefaultGridItemProps = {
  children: ReactNode
}

const DefaultGridItem: React.FC<DefaultGridItemProps> = ({ children }) => {
  return (
    <>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
        {children}
      </Grid>
    </>
  )
}

export default DefaultGridItem
