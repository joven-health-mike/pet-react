// Copyright 2022 Social Fabric, LLC

import React from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid, Typography } from "@mui/material"
import Navbar from "../navbar/Navbar"
import { useNavigate } from "react-router-dom"

const CustomButton = styled.button`
  ${buttonStyles}
  width: 100%;
`

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Typography variant="h4" sx={{ mt: 5 }}>
        Home
      </Typography>
      <Grid container sx={{ p: 10 }}>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
          <CustomButton onClick={() => navigate("/payroll")}>
            Payroll
          </CustomButton>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
          <CustomButton onClick={() => navigate("/invoices")}>
            Invoices
          </CustomButton>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
          <CustomButton onClick={() => navigate("/transactions")}>
            Transactions
          </CustomButton>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
          <CustomButton onClick={() => navigate("/tools")}>Tools</CustomButton>
        </Grid>
        <Grid item xs={12} sm={12} md={12} lg={6} xl={4} sx={{ p: 1 }}>
          <CustomButton onClick={() => navigate("/analytics")}>
            Analytics
          </CustomButton>
        </Grid>
      </Grid>
    </>
  )
}

export default HomePage
