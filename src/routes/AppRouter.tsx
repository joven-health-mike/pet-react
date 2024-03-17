// Copyright 2022 Social Fabric, LLC

import React from "react"
import PrivateRoutes from "./PrivateRoutes"
import HomePage from "../components/pages/HomePage"
import PayrollPage from "../components/pages/PayrollPage"
import InvoicePage from "../components/pages/InvoicePage"
import TransactionsPage from "../components/pages/TransactionPage"
import ToolsPage from "../components/pages/ToolsPage"
import AnalyticsPage from "../components/pages/AnalyticsPage"

const AppRouter: React.FC = () => {
  return <PrivateRoutes />
}

export const AvailableRoutes = [
  { url: "/", element: <HomePage /> },
  { url: "/payroll", element: <PayrollPage /> },
  { url: "/invoices", element: <InvoicePage /> },
  { url: "/transactions", element: <TransactionsPage /> },
  { url: "/tools", element: <ToolsPage /> },
  { url: "/analytics", element: <AnalyticsPage /> },
]

export default AppRouter
