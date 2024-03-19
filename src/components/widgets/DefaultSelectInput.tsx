// Copyright 2022 Social Fabric, LLC

import {
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
  onItemSelected: (item: string, index: number) => void
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
  const [selectedIndex, setSelectedIndex] = useState<number>(0)

  useEffect(() => {
    if (enableSelectAll && onAllSelected !== undefined && selectedIndex === 0) {
      onAllSelected()
    } else if (enableSelectAll && selectedIndex > 0) {
      onItemSelected(items[selectedIndex - 1], selectedIndex - 1)
    } else if (!enableSelectAll) {
      onItemSelected(items[selectedIndex], selectedIndex)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex])

  return (
    <>
      <FormControl fullWidth sx={{ mr: 10 }}>
        <InputLabel id={label.toLowerCase()}>{label}</InputLabel>
        <Select
          labelId={label.toLowerCase()}
          id={label.toLowerCase()}
          defaultValue=""
          value={`${selectedIndex}`}
          label={label}
          onChange={(e: SelectChangeEvent<string>) => {
            console.log(e.target.value)
            setSelectedIndex(parseInt(e.target.value))
          }}
        >
          {enableSelectAll && <MenuItem value={"0"}>{"Select All"}</MenuItem>}
          {items.map((item, index) => {
            const adjIndex = enableSelectAll ? index + 1 : index
            return (
              <MenuItem value={`${adjIndex}`} key={adjIndex}>
                {item}
              </MenuItem>
            )
          })}
        </Select>
      </FormControl>
    </>
  )
}

export default DefaultSelectInput
