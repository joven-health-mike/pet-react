// Copyright 2022 Social Fabric, LLC

import React from "react"
import { BarChart } from "../widgets/BarChart"
import { randomColor } from "../../utils/Colors"

type NoShowChartProps = {
  customerData: Map<string, number>
}

const CHART_LABEL = "No-Show Rates by Customer"

const NoShowChart: React.FC<NoShowChartProps> = ({ customerData }) => {
  const randomColors: string[] = []
  for (let i = 0; i < [...customerData.keys()].length; i++) {
    randomColors.push(randomColor(0.6))
  }
  const noShowChartData = {
    labels: [...customerData.keys()],
    datasets: [
      {
        label: CHART_LABEL,
        data: [...customerData.values()],
        backgroundColor: randomColors,
        borderWidth: 1,
      },
    ],
  }
  return (
    <>
      <BarChart chartTitle={CHART_LABEL} chartData={noShowChartData} />
    </>
  )
}

export default NoShowChart
