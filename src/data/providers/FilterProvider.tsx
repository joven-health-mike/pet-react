import React, { ReactNode, useContext, useEffect, useState } from "react"
import { FilteredSessionsContext } from "./FilteredSessionProvider"

export type FilterDataProviderProps = {
  children?: ReactNode | undefined
}

type FilterContextData = {
  filter: string
  setFilter: (filter: string) => void
}

export const FilterContext = React.createContext<FilterContextData>({
  filter: "",
  setFilter: (filter: string) => null,
})

export const FilterProvider: React.FC<FilterDataProviderProps> = ({
  children,
}) => {
  const [filter, setFilter] = useState<string>("")

  const delegate: FilterContextData = {
    filter: filter,
    setFilter: setFilter,
  }

  const {
    filteredCustomerSessionGroups,
    filteredProviderSessionGroups,
    filteredTypeSessionGroups,
  } = useContext(FilteredSessionsContext)
  const [selectedCustomers, setSelectedCustomers] = useState<string[]>([])
  const [selectedProviders, setSelectedProviders] = useState<string[]>([])
  const [selectedTypes, setSelectedTypes] = useState<string[]>([])

  useEffect(() => {
    const newFilter = [
      ...selectedCustomers,
      ...selectedProviders,
      ...selectedTypes,
    ]
    const newFilterStr = newFilter.join()
    if (filter !== newFilterStr) {
      setFilter(newFilterStr)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCustomers, selectedProviders, selectedTypes])

  useEffect(() => {
    const newCustomerSelections = [...filteredCustomerSessionGroups.names()]
    setSelectedCustomers(newCustomerSelections)
  }, [filteredCustomerSessionGroups])

  useEffect(() => {
    const newProviderSelections = [...filteredProviderSessionGroups.names()]
    setSelectedProviders(newProviderSelections)
  }, [filteredProviderSessionGroups])

  useEffect(() => {
    const newTypeSelections = [...filteredTypeSessionGroups.names()]
    setSelectedTypes(newTypeSelections)
  }, [filteredTypeSessionGroups])

  return (
    <FilterContext.Provider
      value={{
        ...delegate,
      }}
    >
      {children}
    </FilterContext.Provider>
  )
}
