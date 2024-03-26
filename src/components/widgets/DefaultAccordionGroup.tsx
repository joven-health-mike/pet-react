// Copyright 2022 Social Fabric, LLC

import React, { ReactNode } from "react"
import DefaultAccordion from "./DefaultAccordion"

type DefaultAccordionGroupProps = {
  nodes: ReactNode[]
  labels: string[]
  defaultExpanded?: boolean[]
}

const DefaultAccordionGroup: React.FC<DefaultAccordionGroupProps> = ({
  nodes,
  labels,
  defaultExpanded,
}) => {
  return (
    <>
      {nodes.map(
        (node, index) =>
          node && (
            <DefaultAccordion
              label={labels[index]}
              defaultExpanded={defaultExpanded ? defaultExpanded[index] : false}
            >
              {node}
            </DefaultAccordion>
          )
      )}
    </>
  )
}

export default DefaultAccordionGroup
