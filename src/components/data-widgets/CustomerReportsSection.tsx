// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import { SessionsContext } from "../../data/providers/SessionProvider"

const CustomerReportsSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [customerNames, setCustomerNames] = useState<string[]>([])

  useEffect(() => {
    if (customerSessionGroups === undefined) {
      setSelectedCustomer("")
      setCustomerNames([])
    } else {
      const customerNames = [...customerSessionGroups.names()]
      if (
        selectedCustomer.length > 0 &&
        !customerNames.join().includes(selectedCustomer)
      ) {
        setSelectedCustomer(customerNames[0])
      }

      setCustomerNames(customerNames)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [customerSessionGroups])

  return (
    <>
      <>
        {customerSessionGroups && (
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
            {selectedCustomer !== "" && (
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
