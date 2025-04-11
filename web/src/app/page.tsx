"use client"

import { IntervalSelector, MainChart, StatusBox, ValueBox } from "@/components"
import { GraphInterval } from "@/enums"
import { TimeRecord } from "@/types"
import { UnitConnectionStatus } from "@/types/UnitConnectionStatus"
import {
  DATETIME_FORMAT,
  httpClient,
  HUMIDITY_SUFFIX,
  momentByInterval,
  TEMPERATURE_SUFFIX,
} from "@/utils"
import { Button } from "@nextui-org/button"
import { Spinner } from "@nextui-org/spinner"
import moment from "moment-timezone"
import { useEffect, useState } from "react"

const REFRESH_PERIOD_MS = 10_000

export default function Home() {
  const [records, setRecords] = useState<TimeRecord[]>([])
  const [unitStatus, setUnitStatus] = useState<
    UnitConnectionStatus | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(920)
  const [timeframe, setTimeFrame] = useState(GraphInterval.HALF_HOUR)

  const refreshUnitStatus = () => {
    httpClient.get<UnitConnectionStatus>("/status").then((res) => {
      setUnitStatus(res.data)
    })
  }

  const timeToRender = () => {
    const instant = records[records.length - 1]?.timestamp
    if (instant === undefined) {
      return "--/--/-- --:--:--"
    } else {
      return moment(instant).format(DATETIME_FORMAT)
    }
  }

  const refreshData = (interval: GraphInterval) => {
    setLoading(true)
    const intervalQuery = momentByInterval(interval)
    httpClient
      .get<TimeRecord[]>("/records", { params: { interval: intervalQuery } })
      .then((res) => {
        const incomingStats: TimeRecord[] = (res.data as TimeRecord[])
          .filter((s) => s.humidity !== 0 || s.temperature !== 0)
          .sort((s1, s2) =>
            moment(s1.timestamp).isBefore(moment(s2.timestamp)) ? -1 : 1
          )
        setRecords(incomingStats)
        setLoading(false)
      })
  }

  const lastStat: (stats: TimeRecord[]) => TimeRecord | undefined = (
    stats: TimeRecord[]
  ) => stats[stats.length - 1]

  useEffect(() => {
    refreshData(timeframe)
    refreshUnitStatus()
    setHeight(window.innerHeight)
    const refreshInterval = setInterval(
      () => refreshData(timeframe),
      REFRESH_PERIOD_MS
    )
    return () => clearInterval(refreshInterval)
  }, [timeframe])

  return (
    <div className="flex px-8 py-6 h-full">
      <div className="flex flex-col max-w-15 gap-4">
        <StatusBox unitStatus={unitStatus} />
        <ValueBox
          label={"Temperature"}
          value={lastStat(records)?.temperature}
          time={timeToRender()}
          suffix={TEMPERATURE_SUFFIX}
        />
        <ValueBox
          label={"Humidity"}
          value={lastStat(records)?.humidity}
          time={timeToRender()}
          suffix={HUMIDITY_SUFFIX}
        />
        <Button
          className="flex bg-black text-white font-semibold uppercase justify-center rounded-md px-2 py-2 outline-none"
          onPress={() => refreshData(timeframe)}
        >
          {loading ? <Spinner color="white" label={"loading..."} /> : "Refresh"}
        </Button>
        <IntervalSelector
          selected={timeframe}
          itemStyle={
            "bg-black text-white font-semibold uppercase justify-center rounded-md px-2 py-2 outline-none"
          }
          containerStyle={"py-2 flex flex-col gap-y-2"}
          onSelect={setTimeFrame}
          intervals={[
            GraphInterval.ONE_DAY,
            GraphInterval.ONE_WEEK,
            GraphInterval.ONE_MONTH,
            GraphInterval.TWO_WEEKS,
            GraphInterval.HALF_HOUR,
          ]}
        />
      </div>
      {records.length === 0 ? (
        <Spinner />
      ) : (
        <div className="flex-1">
          <MainChart stats={records} height={height} />
        </div>
      )}
    </div>
  )
}
