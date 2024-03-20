// Copyright 2022 Social Fabric, LLC

import React from "react"
import { randomColor } from "../../utils/Colors"
import { PieChart } from "../widgets/PieChart"

const GRAPH_TRANSPARENCY = 0.6

type NoShowPieChartProps = {
  chartTitle: string
  absentRate: number
}

const NoShowPieChart: React.FC<NoShowPieChartProps> = ({
  chartTitle,
  absentRate,
}) => {
  const randomColors: string[] = [
    randomColor(GRAPH_TRANSPARENCY),
    randomColor(GRAPH_TRANSPARENCY),
  ]
  const labels: string[] = ["Present", "Absent"]
  const data: number[] = [1 - absentRate, absentRate]

  const noShowChartData = {
    labels: labels,
    datasets: [
      {
        label: chartTitle,
        data: [...data.values()],
        backgroundColor: randomColors,
        borderWidth: 5,
      },
    ],
  }
  return (
    <>
      <PieChart chartTitle={chartTitle} chartData={noShowChartData} />
    </>
  )
}

export default NoShowPieChart
