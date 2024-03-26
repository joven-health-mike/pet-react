// Copyright 2022 Social Fabric, LLC

import React, { ReactNode, useRef } from "react"
import { useReactToPrint } from "react-to-print"
import styled from "styled-components"
import { buttonStyles } from "../styles/mixins"

const CustomButton = styled.button`
  ${buttonStyles}
  width: 300px;
`

type PrintableProps = {
  docTitle: string
  children: ReactNode
}

const Printable: React.FC<PrintableProps> = ({ docTitle, children }) => {
  const componentRef = useRef(null)
  const handlePrint = useReactToPrint({
    content: () => componentRef.current!,
    documentTitle: docTitle,
  })
  return (
    <>
      <CustomButton onClick={handlePrint}>Download PDF</CustomButton>
      <div ref={componentRef}>{children}</div>
    </>
  )
}

export default Printable
