// Copyright 2022 Social Fabric, LLC

import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectChangeEvent,
} from "@mui/material"
import React, { useEffect, useState } from "react"

type DefaultSelectInputProps = {
  label: string
  items: string[]
  onItemSelected: (item: string) => void
  onAllSelected?: () => void
  enableSelectAll?: boolean
}

const DefaultSelectInput: React.FC<DefaultSelectInputProps> = ({
  label,
  items,
  onItemSelected,
  onAllSelected,
  enableSelectAll = true,
}) => {
  const defaultValue = (items: string[]) =>
    items && items.length > 0 ? items[0] : ""
  const [selection, setSelection] = useState<string>(defaultValue(items))
  const [selectItems, setSelectItems] = useState<React.JSX.Element[]>()

  useEffect(() => {
    console.log(`selection changed: ${selection}`)
    if (
      enableSelectAll &&
      onAllSelected !== undefined &&
      selection === "Select All"
    ) {
      onAllSelected()
    } else if (selection !== "") {
      onItemSelected(selection)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selection])

  useEffect(() => {
    if (items === undefined || items.length === 0) {
      return
    }

    const newMenuItems = items.map((item) => {
      return (
        <MenuItem value={item} key={item}>
          {item}
        </MenuItem>
      )
    })

    if (selection === "") {
      setSelection(items[0])
    } else {
      let shouldUpdateDefault = true
      for (const item of items) {
        if (selection === item) {
          shouldUpdateDefault = false
          break
        }
      }
      if (shouldUpdateDefault) {
        setSelection(items[0])
      }
    }

    if (selection !== "" && !items.join().includes(selection)) {
      setSelection(items[0])
    }

    setSelectItems(newMenuItems)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [items])

  return (
    <>
      <Box justifyContent="center" display="flex">
        <FormControl fullWidth sx={{ m: 2 }}>
          <InputLabel id={label.toLowerCase()}>{label}</InputLabel>
          <Select
            labelId={label.toLowerCase()}
            id={label.toLowerCase()}
            defaultValue={defaultValue(items)}
            value={selection}
            label={label}
            onChange={(e: SelectChangeEvent<string>) => {
              setSelection(e.target.value)
            }}
          >
            {enableSelectAll && (
              <MenuItem value={"Select All"}>{"Select All"}</MenuItem>
            )}
            {selectItems}
          </Select>
        </FormControl>
      </Box>
    </>
  )
}

export default DefaultSelectInput
