// Copyright 2022 Social Fabric, LLC

import React from "react"
import PrivateRoutes from "./PrivateRoutes"
import HomePage from "../components/pages/HomePage"
import PayrollPage from "../components/pages/PayrollPage"
import InvoicePage from "../components/pages/InvoicePage"
import TransactionsPage from "../components/pages/TransactionPage"

const AppRouter: React.FC = () => {
  return <PrivateRoutes />
}

export const AvailableRoutes = [
  { url: "/", element: <HomePage /> },
  { url: "/payroll", element: <PayrollPage /> },
  { url: "/invoices", element: <InvoicePage /> },
  { url: "/transactions", element: <TransactionsPage /> },
]

export default AppRouter
