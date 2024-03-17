// Copyright 2022 Social Fabric, LLC

import React from "react"
import CheckIcon from "@mui/icons-material/Check"

type GreenCheckMarkProps = {
  size?: string
}

const GreenCheckMark: React.FC<GreenCheckMarkProps> = ({ size = "40px" }) => {
  return (
    <>
      <CheckIcon sx={{ color: "green", fontSize: `${size}` }} />
    </>
  )
}

export default GreenCheckMark
