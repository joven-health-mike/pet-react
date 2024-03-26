// Copyright 2022 Social Fabric, LLC

import React from "react"
import { BarChart } from "../../widgets/BarChart"
import { randomColor } from "../../../utils/Colors"

const GRAPH_TRANSPARENCY = 0.6

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
  for (const serviceName of data.keys()) {
    const color = randomColor(GRAPH_TRANSPARENCY)
    for (const month of (data.get(serviceName) ?? new Map()).keys()) {
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
