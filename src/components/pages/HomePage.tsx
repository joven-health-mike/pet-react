// Copyright 2022 Social Fabric, LLC

import React from "react"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"
import Navbar from "../navbar/Navbar"
import { useNavigate } from "react-router-dom"
import DefaultGrid from "../widgets/DefaultGrid"
import DefaultGridItem from "../widgets/DefaultGridItem"
import DefaultHeader from "../widgets/DefaultHeader"

const CustomButton = styled.button`
  ${buttonStyles}
  width: 100%;
`

const HomePage: React.FC = () => {
  const navigate = useNavigate()

  return (
    <>
      <Navbar />
      <DefaultHeader>Home</DefaultHeader>
      <DefaultGrid direction="row">
        <DefaultGridItem>
          <CustomButton onClick={() => navigate("/payroll")}>
            Payroll
          </CustomButton>
        </DefaultGridItem>
        <DefaultGridItem>
          <CustomButton onClick={() => navigate("/invoices")}>
            Invoices
          </CustomButton>
        </DefaultGridItem>
        <DefaultGridItem>
          <CustomButton onClick={() => navigate("/transactions")}>
            Transactions
          </CustomButton>
        </DefaultGridItem>
        <DefaultGridItem>
          <CustomButton onClick={() => navigate("/tools")}>Tools</CustomButton>
        </DefaultGridItem>
      </DefaultGrid>
    </>
  )
}

export default HomePage
