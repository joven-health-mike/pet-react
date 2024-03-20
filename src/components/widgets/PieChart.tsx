import React, { useEffect, useState } from "react"
import { Chart, ChartData, Legend, Tooltip, ArcElement } from "chart.js"
import { Pie } from "react-chartjs-2"
import styled from "styled-components"
import ChartDataLabels from "chartjs-plugin-datalabels"
Chart.register(ArcElement, Tooltip, Legend, ChartDataLabels)

const ChartDiv = styled.div`
  padding: 0px;
`

type PieChartProps = {
  chartTitle: string
  chartData: ChartData<"pie", (number | [number, number] | null)[], unknown>
}

export const PieChart: React.FC<PieChartProps> = ({
  chartTitle,
  chartData,
}) => {
  const [displayTitle, setDisplayTitle] = useState<boolean>(false)

  useEffect(() => {
    setDisplayTitle(chartTitle === "" ? false : true)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <ChartDiv>
      {displayTitle && <h2 style={{ textAlign: "center" }}>{chartTitle}</h2>}
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: displayTitle,
              text: chartTitle,
            },
            legend: {
              display: true,
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
