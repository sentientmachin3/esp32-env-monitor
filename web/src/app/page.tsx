"use client"

import { MainChart } from "@/components/MainChart"
import { StatusBox } from "@/components/StatusBox"
import { ValueBox } from "@/components/ValueBox"
import { GraphInterval } from "@/enums"
import { ParsedRecord, Record } from "@/types"
import { UnitConnectionStatus } from "@/types/UnitConnectionStatus"
import {
  DATETIME_FORMAT,
  httpClient,
  HUMIDITY_SUFFIX,
  TEMPERATURE_SUFFIX,
} from "@/utils"
import { Button } from "@nextui-org/button"
import { Spinner } from "@nextui-org/spinner"
import moment from "moment-timezone"
import { useEffect, useState } from "react"

export default function Home() {
  const [records, setRecords] = useState<ParsedRecord[]>([])
  const [unitStatus, setUnitStatus] = useState<
    UnitConnectionStatus | undefined
  >()
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(920)

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
      return moment.unix(instant).format(DATETIME_FORMAT)
    }
  }

  const refreshData = () => {
    setLoading(true)
    const now = moment()
    const oneDayBefore = moment().subtract(1, "day")
    httpClient
      .get<
        Record[]
      >("/records", { params: { start: oneDayBefore.toISOString(), end: now.toISOString() } })
      .then((res) => {
        const incomingStats: ParsedRecord[] = (res.data as Record[])
          .filter((s) => s.humidity !== 0 || s.temperature !== 0)
          .sort((s1, s2) =>
            moment(s1.timestamp).isBefore(moment(s2.timestamp)) ? -1 : 1
          )
          .map((s) => ({
            ...s,
            timestamp: moment(s.timestamp).unix(),
          }))
        setRecords(incomingStats)
        setLoading(false)
      })
  }

  const lastStat: (stats: ParsedRecord[]) => ParsedRecord | undefined = (
    stats: ParsedRecord[]
  ) => stats[stats.length - 1]

  useEffect(() => {
    refreshData()
    refreshUnitStatus()
    setInterval(() => refreshData(), 10_000)
    setHeight(window.innerHeight)
  }, [])

  return (
    <div className="flex px-8 py-6 h-full">
      <div
        className="flex flex-col max-w-15 gap-4"
        suppressHydrationWarning={true}
      >
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
          onPress={() => refreshData()}
        >
          {loading ? <Spinner color="white" label={"loading..."} /> : "Refresh"}
        </Button>
      </div>
      {loading || records.length === 0 ? (
        <Spinner />
      ) : (
        <div className="flex-1">
          <MainChart
            stats={records}
            height={height}
            interval={GraphInterval.ONE_DAY}
          />
        </div>
      )}
    </div>
  )
}
