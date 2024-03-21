// Copyright 2022 Social Fabric, LLC

import React from "react"
import { LineChart } from "../widgets/LineChart"
import { randomColor } from "../../utils/Colors"

type NoShowByMonthLineChartProps = {
  chartTitle?: string
  data: Map<string, number>
}

const NoShowByMonthLineChart: React.FC<NoShowByMonthLineChartProps> = ({
  chartTitle = "",
  data,
}) => {
  const noShowChartData = {
    labels: [...data.keys()],
    datasets: [
      {
        label: "No-Show Rate",
        data: [...data.values()],
        borderColor: randomColor(1),
        borderWidth: 5,
      },
    ],
  }
  return (
    <>
      <LineChart chartTitle={chartTitle} chartData={noShowChartData} />
    </>
  )
}

export default NoShowByMonthLineChart
