// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import { FilteredSessionsContext } from "../../data/providers/FilteredSessionProvider"

const CustomerReportsSection: React.FC = () => {
  const { filteredCustomerSessionGroups } = useContext(FilteredSessionsContext)
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [customerNames, setCustomerNames] = useState<string[]>([])

  useEffect(() => {
    const newCustomerNames = [...filteredCustomerSessionGroups.names()]
    if (newCustomerNames.length === 0) {
      setSelectedCustomer("")
      setCustomerNames([])
      return
    }
    if (selectedCustomer === undefined) {
      setSelectedCustomer(newCustomerNames[0])
    } else if (
      selectedCustomer.length > 0 &&
      !newCustomerNames.join().includes(selectedCustomer)
    ) {
      setSelectedCustomer(newCustomerNames[0])
    }
    setCustomerNames(newCustomerNames)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filteredCustomerSessionGroups])

  return (
    <>
      <>
        {filteredCustomerSessionGroups && (
          <>
            <DefaultHeader>Customer Reports</DefaultHeader>
            <DefaultSelectInput
              label="Select a Customer"
              items={customerNames}
              enableSelectAll={false}
              onItemSelected={(item) => {
                setSelectedCustomer(item)
              }}
            />
            {customerNames.length > 0 && selectedCustomer !== "" && (
              <>
                <CustomerNameContext.Provider value={selectedCustomer}>
                  <CustomerReport />
                </CustomerNameContext.Provider>
              </>
            )}
          </>
        )}
      </>
    </>
  )
}

export const CustomerNameContext = React.createContext<string>("")

export default CustomerReportsSection
