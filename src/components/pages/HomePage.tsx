// Copyright 2022 Social Fabric, LLC

import React from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import { Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import { useNavigate } from "react-router-dom"

const CustomButton = styled.button`
  ${buttonStyles}
`

const HomePage: React.FC = () => {
  let navigate = useNavigate()

  const onRunPayrollClicked = () => {
    navigate("/payroll")
  }

  const onRunInvoicesClicked = () => {
    navigate("/invoices")
  }

  return (
    <>
      <nav>
        <Navbar />
      </nav>
      <Grid container direction="column" alignItems="center" margin={5}>
        <CustomButton onClick={onRunPayrollClicked}>Run Payroll</CustomButton>
        <CustomButton onClick={onRunInvoicesClicked}>Run Invoices</CustomButton>
      </Grid>
    </>
  )
}

export default HomePage
