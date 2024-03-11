// Copyright 2022 Social Fabric, LLC

import React from "react"
import { Route, Routes } from "react-router-dom"
import styled from "styled-components"
import { AvailableRoutes } from "./AppRouter"
import { h1Styles } from "../components/styles/mixins"

const Header = styled.h1`
  ${h1Styles}
`

const Container = styled.div`
  margin-left: 250px;
`

const PrivateRoutes: React.FC = () => {
  return (
    // allow available routes based on user permissions
    <Routes>
      <>
        {AvailableRoutes.map((route, index) => {
          return (
            <Route
              key={index}
              path={route.url}
              element={<Container>{route.element}</Container>}
            />
          )
        })}
        <Route path="*" element={<Header>404 - Not Found</Header>} />
      </>
    </Routes>
  )
}

export default PrivateRoutes
