// Copyright 2022 Social Fabric, LLC

import React from "react"
import { randomColor } from "../../utils/Colors"
import { PieChart } from "../widgets/PieChart"

const GRAPH_TRANSPARENCY = 0.6

type NoShowPieChartProps = {
  chartTitle?: string
  presences: number
  absences: number
}

const NoShowPieChart: React.FC<NoShowPieChartProps> = ({
  chartTitle = "",
  presences,
  absences,
}) => {
  const randomColors: string[] = [
    randomColor(GRAPH_TRANSPARENCY),
    randomColor(GRAPH_TRANSPARENCY),
  ]
  const labels: string[] = ["Present", "Absent"]

  const noShowChartData = {
    labels: labels,
    datasets: [
      {
        label: chartTitle,
        data: [presences, absences],
        backgroundColor: randomColors,
        borderWidth: 1,
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
