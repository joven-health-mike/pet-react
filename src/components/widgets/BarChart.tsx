import React from "react"
import {
  Chart,
  ChartData,
  CategoryScale,
  LinearScale,
  BarElement,
} from "chart.js"
import { Bar } from "react-chartjs-2"
import styled from "styled-components"
import { chartStyles } from "../styles/mixins"
Chart.register(CategoryScale)
Chart.register(LinearScale)
Chart.register(BarElement)

const ChartDiv = styled.div`
  ${chartStyles}
`

type BarChartProps = {
  chartTitle: string
  chartData: ChartData<"bar", (number | [number, number] | null)[], unknown>
}

export const BarChart: React.FC<BarChartProps> = ({
  chartTitle,
  chartData,
}) => {
  return (
    <ChartDiv>
      <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>
      <Bar
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: chartTitle,
            },
            legend: {
              display: false,
            },
          },
        }}
      />
    </ChartDiv>
  )
}
