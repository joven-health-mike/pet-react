// Copyright 2022 Social Fabric, LLC

import React, { useContext, useEffect, useState } from "react"
import DefaultMultiSelectInput from "../widgets/DefaultMultiSelectInput"
import Session from "../../data/Session"
import { FilteredSessionsContext } from "../../data/providers/FilteredSessionProvider"
import { SessionsContext } from "../../data/providers/SessionProvider"

const ProviderFilter: React.FC = () => {
  const { providerSessionGroups: allProviderSessionGroups } =
    useContext(SessionsContext)
  const { filteredProviderSessionGroups } = useContext(FilteredSessionsContext)
  const [names, setNames] = useState<string[]>([])
  const [selections, setSelections] = useState<string[]>([])

  useEffect(() => {
    const newNames = [...filteredProviderSessionGroups.names()]
    setNames(newNames)
  }, [filteredProviderSessionGroups])

  useEffect(() => {
    const newNames = [...allProviderSessionGroups.names()]
    setNames(newNames)
  }, [allProviderSessionGroups])

  useEffect(() => {
    if (selections === undefined) {
      return
    }

    // onProviderFilterChanged(selections)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selections])

  return (
    <>
      <DefaultMultiSelectInput
        label="Provider"
        items={names}
        defaultSelection={[...selections]}
        onItemsSelected={(items) => {
          console.log(`setSelections changed: ${items}`)
          setSelections([...items])
        }}
      />
    </>
  )
}

export const byProvider = (session: Session) => session.providerName

export default ProviderFilter
