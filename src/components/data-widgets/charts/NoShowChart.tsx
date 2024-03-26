// Copyright 2022 Social Fabric, LLC

import React from "react"
import { BarChart } from "../../widgets/BarChart"
import { randomColor } from "../../../utils/Colors"

type NoShowChartProps = {
  chartTitle: string
  data: Map<string, number>
}

const NoShowChart: React.FC<NoShowChartProps> = ({ chartTitle, data }) => {
  const randomColors: string[] = []
  Array.from({ length: data.size }).forEach(() => {
    randomColors.push(randomColor(0.6))
  })
  const noShowChartData = {
    labels: [...data.keys()],
    datasets: [
      {
        label: "No-Show Rate",
        data: [...data.values()],
        backgroundColor: randomColors,
        borderWidth: 1,
      },
    ],
  }

  return (
    <>
      <BarChart chartTitle={chartTitle} chartData={noShowChartData} />
    </>
  )
}

export default NoShowChart
