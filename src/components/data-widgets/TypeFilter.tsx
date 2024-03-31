// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import { SessionsContext } from "../../data/providers/SessionProvider"
import DefaultMultiSelectInput from "../widgets/DefaultMultiSelectInput"
import Session from "../../data/Session"

const TypeFilter: React.FC = () => {
  const { typeSessionGroups: allTypeSessionGroups } =
    useContext(SessionsContext)
  const [names, setNames] = useState<string[]>([])
  const [selections, setSelections] = useState<string[]>([])

  useEffect(() => {
    const newNames = [...allTypeSessionGroups.names()]
    setNames(newNames)
    setSelections(newNames)
  }, [allTypeSessionGroups])

  useEffect(() => {
    if (selections === undefined) {
      return
    }

    // onTypeFilterChanged(selections)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections])

  return (
    <>
      <DefaultMultiSelectInput
        label="Type"
        items={names}
        defaultSelection={[...selections]}
        onItemsSelected={(items) => {
          setSelections([...items])
        }}
      />
    </>
  )
}

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

export default TypeFilter
