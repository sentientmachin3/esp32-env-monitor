"use client"

import { MainChart } from "@/components/MainChart"
import { ValueBox } from "@/components/ValueBox"
import { Stat } from "@/types"
import { httpClient } from "@/utils"
import { Spinner } from "@nextui-org/spinner"
import moment from "moment"
import { useEffect, useState } from "react"

export default function Home() {
  const [stats, setStats] = useState<Stat[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    httpClient
      .get<
        Stat[]
      >("/stats", { headers: { "Content-Type": "application/json" } })
      .then((res) => {
        const incomingStats = (res.data as Stat[])
          .filter((s) => s.humidity !== 0 && s.temperature !== 0)
          .sort((s1, s2) => s1.timestamp - s2.timestamp)
        setStats(incomingStats)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <Spinner />
  }

  return (
    <div className="flex px-8 py-6">
      <div className="flex flex-col max-w-15 gap-4">
        <ValueBox
          label={"Temperature"}
          value={stats[stats.length - 1].temperature}
          moment={moment.unix(stats[stats.length - 1].timestamp)}
          suffix={"°C"}
        />
        <ValueBox
          label={"Humidity"}
          value={stats[stats.length - 1].humidity}
          moment={moment.unix(stats[stats.length - 1].timestamp)}
          suffix={"%"}
        />
      </div>
      <div className="flex-1">
        <MainChart stats={stats} />
      </div>
    </div>
  )
}
