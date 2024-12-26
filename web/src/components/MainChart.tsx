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

export function MainChart({ stats }: { stats: Stat[] }) {
  const timeFormatter = (time: Date) => moment(time).format(DATETIME_FORMAT)

  return (
    <div>
      <ResponsiveContainer
        width="100%"
        height={window.innerHeight / 2}
        className="px-8 py-8"
      >
        <LineChart syncId={"sync"} width={500} height={300} data={stats}>
          <XAxis
            dataKey={(stat: Stat) => moment.unix(stat.timestamp).toDate()}
            scale="time"
            tickFormatter={timeFormatter}
            type="number"
            domain={["auto", "auto"]}
          />
          <YAxis />
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
        height={window.innerHeight / 2}
        className="px-8 py-8"
      >
        <LineChart syncId={"sync"} width={500} height={300} data={stats}>
          <XAxis
            scale="time"
            dataKey={(stat: Stat) => moment.unix(stat.timestamp).toDate()}
            tickFormatter={timeFormatter}
            type="number"
            domain={["auto", "auto"]}
          />
          <YAxis />
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
