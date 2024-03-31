// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultMultiSelectInput from "../widgets/DefaultMultiSelectInput"
import Session from "../../data/Session"
import { useSessionGroupFilter } from "../hooks/SessionGroupFilterHook"
import { FilterContext } from "../../data/providers/FilterProvider"

const CustomerFilter: React.FC = () => {
  const { setFilter } = useContext(FilterContext)
  const sessionGroupFilter = useSessionGroupFilter()
  const [customerNames, setCustomerNames] = useState<string[]>([])
  const [customerSelections, setCustomerSelections] = useState<string[]>([])

  useEffect(() => {
    const newCustomerNames = [...sessionGroupFilter.names()]
    setCustomerNames(newCustomerNames)
    setCustomerSelections(newCustomerNames)
  }, [sessionGroupFilter])

  useEffect(() => {
    if (customerSelections === undefined) {
      return
    }

    setFilter(customerSelections.join())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSelections])

  return (
    <>
      <DefaultMultiSelectInput
        label="Customer"
        items={customerNames}
        defaultSelection={[...customerSelections]}
        onItemsSelected={(items) => {
          setCustomerSelections([...items])
        }}
      />
    </>
  )
}

export const byCustomer = (session: Session) => session.schoolName

export default CustomerFilter
