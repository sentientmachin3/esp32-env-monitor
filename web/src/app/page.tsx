"use client"

import { MainChart } from "@/components/MainChart"
import { ValueBox } from "@/components/ValueBox"
import { Record } from "@/types"
import { httpClient, HUMIDITY_SUFFIX, TEMPERATURE_SUFFIX } from "@/utils"
import { Spinner } from "@nextui-org/spinner"
import { Button } from "@nextui-org/button"
import moment from "moment"
import { useEffect, useState } from "react"
import { StatusBox } from "@/components/StatusBox"
import { UnitConnectionStatus } from "@/types/UnitConnectionStatus"
import { UnitStatus } from "@/enums"

export default function Home() {
  const [records, setRecords] = useState<Record[]>([])
  const [unitStatus, setUnitStatus] = useState<UnitConnectionStatus>({
    status: UnitStatus.OFFLINE,
    lastUpdate: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(920)

  const refreshUnitStatus = () => {
    httpClient.get<UnitConnectionStatus>("/status").then((res) => {
      setUnitStatus(res.data)
    })
  }

  const refreshData = () => {
    setLoading(true)
    const now = moment()
    const oneDayBefore = moment().subtract(30, "minutes")
    httpClient
      .get<
        Record[]
      >("/records", { params: { start: oneDayBefore.toISOString(), end: now.toISOString() } })
      .then((res) => {
        const incomingStats = (res.data as Record[])
          .filter((s) => s.humidity !== 0 && s.temperature !== 0)
          .sort((s1, s2) => s1.timestamp - s2.timestamp)
        setRecords(incomingStats)
        setLoading(false)
      })
  }

  const lastStat: (stats: Record[]) => Record | undefined = (stats: Record[]) =>
    stats[stats.length - 1]

  useEffect(() => {
    refreshData()
    refreshUnitStatus()
    setInterval(() => refreshData(), 10_000)
    setHeight(window.innerHeight)
  }, [])

  return (
    <div className="flex px-8 py-6 h-full">
      <div className="flex flex-col max-w-15 gap-4">
        <StatusBox unitStatus={unitStatus} />
        <ValueBox
          label={"Temperature"}
          value={lastStat(records)?.temperature}
          moment={moment.unix(records[records.length - 1]?.timestamp)}
          suffix={TEMPERATURE_SUFFIX}
        />
        <ValueBox
          label={"Humidity"}
          value={lastStat(records)?.humidity}
          moment={moment.unix(records[records.length - 1]?.timestamp)}
          suffix={HUMIDITY_SUFFIX}
        />
        <Button
          className="flex bg-black text-white font-semibold uppercase justify-center rounded-md px-2 py-2 outline-none"
          onPress={() => refreshData()}
        >
          {loading ? <Spinner color="white" label={"loading..."} /> : "Refresh"}
        </Button>
      </div>
      <div className="flex-1">
        <MainChart stats={records} height={height} />
      </div>
    </div>
  )
}
