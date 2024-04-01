// Copyright 2022 Social Fabric, LLC

import React, { useEffect, useState } from "react"
import DefaultMultiSelectInput from "../widgets/DefaultMultiSelectInput"
import Session from "../../data/Session"

type SelectByNameProps = {
  label?: string
  names: string[]
  defaultSelectAll?: boolean
  onFilterUpdated?: (newFilter: string[]) => void
}

const SelectByName: React.FC<SelectByNameProps> = ({
  label = "",
  names,
  defaultSelectAll = false,
  onFilterUpdated = () => {},
}) => {
  const [defaultSelection, setDefaultSelection] = useState<string[]>([])

  useEffect(() => {
    const newDefaultSelection = defaultSelectAll ? [...names] : []
    setDefaultSelection(newDefaultSelection)
  }, [defaultSelectAll, names])

  return (
    <>
      <DefaultMultiSelectInput
        label={label}
        items={names}
        defaultSelection={defaultSelection}
        onItemsSelected={(items) => {
          onFilterUpdated([...items])
        }}
      />
    </>
  )
}

export const byCustomer = (session: Session) => session.schoolName
export const byProvider = (session: Session) => session.providerName
export const byType = (session: Session) => {
  if (
    session.serviceName.includes("Psych") ||
    session.serviceName.includes("SpEd") ||
    session.serviceName.includes("Social Work")
  ) {
    return "Special Education"
  } else if (session.serviceName.includes("Teaching")) {
    return "Teaching"
  } else if (session.serviceName.includes("Mental Health Counseling")) {
    return "Counseling"
  } else if (
    session.serviceName.includes("Speech Therapy") ||
    session.serviceName.includes("Evaluation")
  ) {
    return "Speech"
  }
  return "Indirect Time"
}

export default SelectByName
