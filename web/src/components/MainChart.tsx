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
import Annotation from "chartjs-plugin-annotation"
import moment from "moment"
import { useMemo } from "react"
import { Line } from "react-chartjs-2"

Chart.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  TimeScale,
  Annotation
)

const commonOptions = {
  animation: {
    duration: 0,
  },
  responsive: true,
  maintainAspectRatio: false,
}

const META_AVG_COLOR = "#7e7af4"
const DATA_COLOR = "#cdcec8"

export function MainChart({
  stats,
  height,
  meta,
}: {
  stats: TimeRecord[]
  height: number
  meta: { avg: { humidity: number; temperature: number } }
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
            plugins: {
              title: {
                display: true,
                text: `Temperature (${TEMPERATURE_SUFFIX})`,
                font: { size: 16 },
              },
              annotation: {
                annotations: [
                  {
                    type: "line",
                    yMin: meta.avg.temperature,
                    yMax: meta.avg.temperature,
                    borderColor: META_AVG_COLOR,
                    borderWidth: 2,
                    label: {
                      display: true,
                      backgroundColor: META_AVG_COLOR,
                      drawTime: "afterDatasetsDraw",
                      content: `AVG ${meta.avg.temperature} ${TEMPERATURE_SUFFIX}`,
                    },
                  },
                ],
              },
            },
          }}
          data={{
            datasets: [
              {
                label: "Temperature",
                data: temperatures,
                borderColor: DATA_COLOR,
              },
            ],
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
            plugins: {
              title: {
                display: true,
                text: `Humidity (${HUMIDITY_SUFFIX})`,
                font: { size: 16 },
              },
              annotation: {
                annotations: [
                  {
                    type: "line",
                    yMin: meta.avg.humidity,
                    yMax: meta.avg.humidity,
                    borderColor: META_AVG_COLOR,
                    borderWidth: 2,
                    label: {
                      display: true,
                      backgroundColor: META_AVG_COLOR,
                      drawTime: "afterDatasetsDraw",
                      content: `AVG ${meta.avg.humidity} ${HUMIDITY_SUFFIX}`,
                    },
                  },
                ],
              },
            },
          }}
          data={{
            datasets: [
              { label: "Humidity", data: humidities, borderColor: DATA_COLOR },
            ],
          }}
        ></Line>
      </div>
    </div>
  )
}
