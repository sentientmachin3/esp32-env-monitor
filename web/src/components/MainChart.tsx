"use client"

import { Stat } from "@/types"
import { DATETIME_FORMAT } from "@/utils"
import moment from "moment"
import {
  CartesianGrid,
  Legend,
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
  stats: Stat[]
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
            name={"Temperature"}
            scale={"time"}
            dataKey={"timestamp"}
            tickFormatter={timeFormatter}
            type="number"
            domain={["auto", "auto"]}
          />
          <YAxis domain={[0, 50]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="temperature"
            stroke="#82ca9d"
            activeDot={{ r: 8 }}
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
            name={"Humidity"}
            scale={"time"}
            dataKey={"timestamp"}
            tickFormatter={timeFormatter}
            type="number"
            domain={["auto", "auto"]}
          />
          <YAxis domain={[20, 90]} />
          <Tooltip />
          <Legend />
          <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
          <Line
            type="monotone"
            dataKey="humidity"
            stroke="#8884d8"
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
