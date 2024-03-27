// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultHeader from "../widgets/DefaultHeader"
import DefaultSelectInput from "../widgets/DefaultSelectInput"
import CustomerReport from "./CustomerReport"
import { SessionsContext } from "../../data/providers/SessionProvider"

const CustomerReportsSection: React.FC = () => {
  const { customerSessionGroups } = useContext(SessionsContext)
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [numCustomers, setNumCustomers] = useState<number>(0)

  useEffect(() => {
    if (!customerSessionGroups) {
      setNumCustomers(0)
    } else {
      const customerNames = [...customerSessionGroups.names()]
      setNumCustomers(customerNames.length)
    }
  }, [customerSessionGroups])

  useEffect(() => {
    if (!customerSessionGroups || numCustomers === 0) {
      setSelectedCustomer("")
    } else {
      const customerNames = [...customerSessionGroups.names()]
      setSelectedCustomer(customerNames[0])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numCustomers])

  return (
    <>
      <>
        {customerSessionGroups && (
          <>
            <DefaultHeader>Customer Reports</DefaultHeader>
            <DefaultSelectInput
              label="Select a Customer"
              items={[...customerSessionGroups.names()]}
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
