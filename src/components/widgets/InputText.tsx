// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import { FormControl, Input, InputLabel } from "@mui/material"

type InputTextProps = {
  name: string
  prompt: string
  onTextChanged: (newText: string) => void
}

const InputText: React.FC<InputTextProps> = ({
  name,
  prompt,
  onTextChanged,
}) => {
  const [text, setText] = useState<string>("")

  useEffect(() => {
    onTextChanged(text)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [text.length])

  return (
    <>
      <FormControl required sx={{ mt: 2, mb: 2, mr: 5 }}>
        <InputLabel id={name}>{prompt}</InputLabel>
        <Input
          id={name}
          value={text}
          onChange={(e) => {
            setText(e.target.value)
          }}
        />
      </FormControl>
    </>
  )
}

export default InputText
