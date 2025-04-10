"use client"

import { GraphInterval } from "@/enums"
import { ParsedRecord } from "@/types"
import { DATETIME_FORMAT, HUMIDITY_SUFFIX, TEMPERATURE_SUFFIX } from "@/utils"
import moment from "moment"
import { useMemo } from "react"
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
  interval,
}: {
  stats: ParsedRecord[]
  height: number
  interval: GraphInterval
}) {
  const timeFormatter = (time: number) =>
    moment.unix(time).format(DATETIME_FORMAT)

  const ticks = useMemo(() => {
    const result: number[] = []
    let nextInstant = moment().subtract(1, "day").startOf("hour")
    result.push(nextInstant.unix())
    while (nextInstant.isBefore(moment())) {
      nextInstant = nextInstant.clone().add(30, "minutes")
      result.push(nextInstant.unix())
    }
    return result
  }, [interval])

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
            ticks={ticks}
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
            isAnimationActive={false}
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
            ticks={ticks}
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
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
