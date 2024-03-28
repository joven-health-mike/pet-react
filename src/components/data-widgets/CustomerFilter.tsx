// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import { SessionsContext } from "../../data/providers/SessionProvider"
import DefaultMultiSelectInput from "../widgets/DefaultMultiSelectInput"
import { FilteredSessionsContext } from "../../data/providers/FilteredSessionProvider"

type CustomerFilterProps = {
  onCustomerFilterChanged: (selections: string[]) => void
}

const CustomerFilter: React.FC<CustomerFilterProps> = ({
  onCustomerFilterChanged,
}) => {
  const { customerSessionGroups: allCustomerSessionGroups } =
    useContext(SessionsContext)
  const { filteredCustomerSessionGroups } = useContext(FilteredSessionsContext)
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [customerSelections, setCustomerSelections] = useState<string[]>([])

  useEffect(() => {
    const newCustomerNames = [...allCustomerSessionGroups.names()]
    setCustomerNames(newCustomerNames)
    setCustomerSelections(newCustomerNames)
  }, [allCustomerSessionGroups])

  useEffect(() => {
    if (customerSelections === undefined) {
      return
    }

    onCustomerFilterChanged(customerSelections)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSelections])

  useEffect(() => {
    const newCustomerSelections = [...filteredCustomerSessionGroups.names()]
    setCustomerSelections(newCustomerSelections)
  }, [filteredCustomerSessionGroups])

  return (
    <>
      <DefaultMultiSelectInput
        label="Customer"
        items={customerNames}
        defaultSelection={customerSelections}
        onItemsSelected={(items) => {
          setCustomerSelections([...items])
        }}
      />
    </>
  )
}

export default CustomerFilter
