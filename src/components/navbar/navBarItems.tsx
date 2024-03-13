// Copyright 2022 Social Fabric, LLC

import React, { ReactElement } from "react"
import { FaHome, FaMoneyBill, FaMoneyCheck } from "react-icons/fa"
import styled from "styled-components"
import image from "../../assets/Logo-192sq-alphabg.png"

const Image = styled.img`
  height: 19px;
  width: 19px;
`

export type NavItem = {
  title: string
  icon: ReactElement
  path: string
}

export const allNavItems: NavItem[] = [
  {
    title: "Joven Health",
    icon: <Image src={image} alt="logo" />,
    path: "/",
  },
  {
    title: "Home",
    icon: <FaHome />,
    path: "/",
  },
  {
    title: "Payroll",
    icon: <FaMoneyBill />,
    path: "/payroll",
  },
  {
    title: "Invoices",
    icon: <FaMoneyCheck />,
    path: "/invoices",
  },
]
