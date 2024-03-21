import React from "react"
import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ChartData,
} from "chart.js"
import styled from "styled-components"
import ChartDataLabels from "chartjs-plugin-datalabels"
import { Line } from "react-chartjs-2"
Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
)

const ChartDiv = styled.div`
  padding: 50px;
`

type LineChartProps = {
  chartTitle: string
  chartData: ChartData<"line", (number | [number, number] | null)[], unknown>
}

export const LineChart: React.FC<LineChartProps> = ({
  chartTitle,
  chartData,
}) => {
  return (
    <ChartDiv>
      <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>
      <Line
        data={chartData}
        plugins={[ChartDataLabels]}
        options={{
          plugins: {
            legend: {
              display: false,
            },
            title: {
              display: false,
            },
            datalabels: {
              color: "#000",
              display: true,
            },
          },
        }}
      />
    </ChartDiv>
  )
}
