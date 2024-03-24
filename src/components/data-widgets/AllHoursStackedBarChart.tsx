// Copyright 2022 Social Fabric, LLC

import React from "react"
import { BarChart } from "../widgets/BarChart"
import { randomColor } from "../../utils/Colors"

type AllHoursStackedBarChartProps = {
  chartTitle: string
  data: Map<string, Map<string, number>>
}

const AllHoursStackedBarChart: React.FC<AllHoursStackedBarChartProps> = ({
  chartTitle,
  data,
}) => {
  const dataSets = []
  const dataLabels = new Set<string>()
  // TODO: Figure out how to sort by schoolyear instead of calendar year...
  for (const serviceName of data.keys()) {
    const color = randomColor(0.6)
    for (const month of (data.get(serviceName) || new Map()).keys()) {
      dataLabels.add(month)
    }
    const dataSet = [...data.get(serviceName)!.values()]
    dataSets.push({
      label: serviceName,
      data: dataSet,
      backgroundColor: color,
      borderWidth: 1,
    })
  }

  const noShowChartData = {
    labels: [...dataLabels],
    datasets: dataSets,
  }

  return (
    <>
      <BarChart
        chartTitle={chartTitle}
        chartData={noShowChartData}
        enableLegend={true}
      />
    </>
  )
}

export default AllHoursStackedBarChart
