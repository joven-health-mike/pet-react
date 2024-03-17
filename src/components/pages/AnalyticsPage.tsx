// Copyright 2022 Social Fabric, LLC

import React from "react"
import Navbar from "../navbar/Navbar"
import { Typography } from "@mui/material"

const AnalyticsPage: React.FC = () => {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Analytics
      </Typography>
    </>
  )
}

export default AnalyticsPage
