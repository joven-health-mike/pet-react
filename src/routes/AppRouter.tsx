// Copyright 2022 Social Fabric, LLC

import React from "react"
import PrivateRoutes from "./PrivateRoutes"
import HomePage from "../components/pages/HomePage"

const AppRouter: React.FC = () => {
  return <PrivateRoutes />
}

export const AvailableRoutes = [{ url: "/", element: <HomePage /> }]

export default AppRouter
