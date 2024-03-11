// Copyright 2022 Social Fabric, LLC

import React from "react"
import { Grid, Typography } from "@mui/material"
import Navbar from "../navbar/Navbar"

const HomePage: React.FC = () => {
  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <AdminView />
    </>
  )
}

const AdminView: React.FC = () => {
  return (
    <Grid container>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
        <Typography variant="h4">All Appointments</Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
        <Typography variant="h4">All Students</Typography>
      </Grid>
    </Grid>
  )
}

export default HomePage
