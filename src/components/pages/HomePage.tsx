// Copyright 2022 Social Fabric, LLC

import React from "react"
import { Grid } from "@mui/material"
import Navbar from "../navbar/Navbar"
import UploadDataWidget from "../widgets/UploadDataWidget"

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

const onUploadContractorsClicked = () => {
  alert("onUpdateContractorsClicked")
}

const onUploadCustomersClicked = () => {
  alert("onUploadCustomersClicked")
}

const onUploadInvoiceParamsClicked = () => {
  alert("onUploadInvoiceParamsClicked")
}

const onUploadProviderReportClicked = () => {
  alert("onUploadProviderReportClicked")
}

const AdminView: React.FC = () => {
  return (
    <Grid container direction="column" alignItems="center">
      <UploadDataWidget
        prompt="Contractors"
        callback={onUploadContractorsClicked}
      />
      <UploadDataWidget
        prompt="Customers"
        callback={onUploadCustomersClicked}
      />
      <UploadDataWidget
        prompt="Invoice Parameters"
        callback={onUploadInvoiceParamsClicked}
      />
      <UploadDataWidget
        prompt="Provider Report"
        callback={onUploadProviderReportClicked}
      />
    </Grid>
  )
}

export default HomePage
