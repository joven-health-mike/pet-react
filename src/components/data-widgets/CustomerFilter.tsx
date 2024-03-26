// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import { SessionsContext } from "../../data/providers/SessionProvider"
import DefaultMultiSelectInput from "../widgets/DefaultMultiSelectInput"
import Session from "../../data/Session"

const CustomerFilter: React.FC = () => {
  const {
    allSessions,
    allCustomerSessionGroups: customerSessionGroups,
    setFilteredSessions,
  } = useContext(SessionsContext)
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [customerSelections, setCustomerSelections] = useState<string[]>([])

  const onCustomersSelected = (selections: string[]) => {
    const filteredSessions = []
    for (const filteredSession of generateFilteredSessions(
      allSessions,
      selections
    )) {
      filteredSessions.push(filteredSession)
    }

    setFilteredSessions(filteredSessions)
  }

  function* generateFilteredSessions(
    sessions: Session[],
    selections: string[]
  ) {
    if (selections.length === 0) return

    for (const session of sessions) {
      for (const selection of selections) {
        if (selection === session.schoolName) {
          yield session
          break
        }
      }
    }
  }

  useEffect(() => {
    if (!customerSessionGroups) return

    const newCustomerNames = []
    for (const customerName of customerSessionGroups.names()) {
      newCustomerNames.push(customerName)
    }
    setCustomerNames(newCustomerNames)
  }, [customerSessionGroups])

  useEffect(() => {
    if (!customerSelections) return

    onCustomersSelected(customerSelections)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSelections])

  return (
    <>
      <DefaultMultiSelectInput
        label="Customer"
        items={customerNames}
        onItemsSelected={(items) => {
          const newSelections = []
          for (const item of items) {
            newSelections.push(item)
          }
          setCustomerSelections(newSelections)
        }}
      />
    </>
  )
}

export default CustomerFilter
