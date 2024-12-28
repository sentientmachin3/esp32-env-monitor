"use client"

import { Record } from "@/types"
import { DATETIME_FORMAT, HUMIDITY_SUFFIX, TEMPERATURE_SUFFIX } from "@/utils"
import moment from "moment"
import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export function MainChart({
  stats,
  height,
}: {
  stats: Record[]
  height: number
}) {
  const timeFormatter = (time: number) =>
    moment.unix(time).format(DATETIME_FORMAT)

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={height / 2}
        className="px-8 py-8"
      >
        <LineChart syncId={"sync"} width={500} height={300} data={stats}>
          <XAxis
            scale={"time"}
            dataKey={"timestamp"}
            tickFormatter={timeFormatter}
            type="number"
            domain={["auto", "auto"]}
          />
          <YAxis domain={[0, 50]} />
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            formatter={(value) => [
              `${value} ${TEMPERATURE_SUFFIX}`,
              "Temperature",
            ]}
            labelFormatter={(label) =>
              moment.unix(Number(label)).format(DATETIME_FORMAT)
            }
          />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>

      <ResponsiveContainer
        width="100%"
        height={height / 2}
        className="px-8 py-8"
      >
        <LineChart syncId={"sync"} width={500} height={300} data={stats}>
          <XAxis
            scale={"time"}
            dataKey={"timestamp"}
            tickFormatter={timeFormatter}
            type="number"
            domain={["auto", "auto"]}
          />
          <Tooltip
            wrapperStyle={{ outline: "none" }}
            formatter={(value) => [`${value} ${HUMIDITY_SUFFIX}`, "Humidity"]}
            labelFormatter={(label) =>
              moment.unix(Number(label)).format(DATETIME_FORMAT)
            }
          />
          <YAxis domain={[20, 90]} />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
