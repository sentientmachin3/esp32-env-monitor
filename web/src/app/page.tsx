"use client"

import { MainChart } from "@/components/MainChart"
import { ValueBox } from "@/components/ValueBox"
import { Stat } from "@/types"
import { httpClient } from "@/utils"
import { Spinner } from "@nextui-org/spinner"
import { Button } from "@nextui-org/button"
import moment from "moment"
import { useEffect, useState } from "react"

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(false)
  const [height, setHeight] = useState(920)

  const refreshData = () => {
    setLoading(true)
    const now = moment()
    const oneDayBefore = moment().subtract(30, "minutes")
    httpClient
      .get<
        Stat[]
      >("/stats", { headers: { "Content-Type": "application/json" }, params: { start: oneDayBefore.unix(), end: now.unix() } })
      .then((res) => {
        const incomingStats = (res.data as Stat[])
          .filter((s) => s.humidity !== 0 && s.temperature !== 0)
          .sort((s1, s2) => s1.timestamp - s2.timestamp)
        setStats(incomingStats)
        setLoading(false)
      })
  }

  useEffect(() => {
    refreshData()
    setHeight(window.innerHeight)
  }, [])

  return (
    <div className="flex px-8 py-6 h-full">
      <div className="flex flex-col max-w-15 gap-4">
        <ValueBox
          label={"Temperature"}
          value={stats[stats.length - 1]?.temperature}
          moment={moment.unix(stats[stats.length - 1]?.timestamp)}
          suffix={"°C"}
        />
        <ValueBox
          label={"Humidity"}
          value={stats[stats.length - 1]?.humidity}
          moment={moment.unix(stats[stats.length - 1]?.timestamp)}
          suffix={"%"}
        />
        <Button
          className="flex bg-black text-white font-semibold uppercase justify-center rounded-md px-2 py-2 outline-none"
          onPress={() => refreshData()}
        >
          {loading ? <Spinner color="white" label={"loading..."} /> : "Refresh"}
        </Button>
      </div>
      <div className="flex-1">
        <MainChart stats={stats} height={height} />
      </div>
    </div>
  )
}
