"use client"

import { TimeRecord } from "@/types"
import { DATETIME_FORMAT, HUMIDITY_SUFFIX, TEMPERATURE_SUFFIX } from "@/utils"
import {
  CategoryScale,
  Chart,
  LinearScale,
  LineElement,
  PointElement,
  TimeScale,
  Title,
} from "chart.js"
import "chartjs-adapter-moment"
import moment from "moment"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale
)

const commonOptions = {
  animation: {
    duration: 0,
  },
  responsive: true,
  maintainAspectRatio: false,
}

export function MainChart({
  stats,
  height,
}: {
  stats: TimeRecord[]
  height: number
}) {
  const temperatures = useMemo(() => {
    return stats.map((r) => ({
      x: moment(r.timestamp),
      y: r.temperature,
    }))
  }, [stats])

  const humidities = useMemo(() => {
    return stats.map((r) => ({
      x: moment(r.timestamp),
      y: r.humidity,
    }))
  }, [stats])

  return (
    <div>
      <div className="relative">
        <Line
          height={height / 2}
          title={`Temperature (${TEMPERATURE_SUFFIX})`}
          options={{
            ...commonOptions,
            scales: {
              x: {
                type: "time",
                ticks: {
                  source: "data",
                  callback: (value) =>
                    moment(Number(value)).format(DATETIME_FORMAT),
                },
              },
              y: {
                min: 0,
                max: 50,
              },
            },
          }}
          data={{
            datasets: [{ label: "Temperature", data: temperatures }],
          }}
        ></Line>
      </div>
      <div className={"relative"}>
        <Line
          height={height / 2}
          title={`Humidity (${HUMIDITY_SUFFIX})`}
          options={{
            ...commonOptions,
            scales: {
              x: {
                type: "time",
                ticks: {
                  source: "data",
                  callback: (value) =>
                    moment(Number(value)).format(DATETIME_FORMAT),
                },
              },
              y: {
                min: 20,
                max: 70,
              },
            },
          }}
          data={{
            datasets: [{ label: "Humidity", data: humidities }],
          }}
        ></Line>
      </div>
    </div>
  )
}
