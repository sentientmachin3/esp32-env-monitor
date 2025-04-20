"use client"

import { IntervalSelector, StatusBox, ValueBox, DataView } from "@/components"
import { GraphInterval } from "@/enums"
import { useRecords, useUnitStatus } from "@/hooks"
import { TimeRecord } from "@/types"
import { DATETIME_FORMAT, HUMIDITY_SUFFIX, TEMPERATURE_SUFFIX } from "@/utils"
import { Button } from "@nextui-org/button"
import { Spinner } from "@heroui/spinner"
import moment from "moment-timezone"
import { useEffect, useState } from "react"

const REFRESH_PERIOD_MS = 10_000

export default function Home() {
  const [height, setHeight] = useState(920)
  const [timeframe, setTimeFrame] = useState(GraphInterval.HALF_HOUR)
  const {
    data: records,
    handler: refreshRecords,
    loading: recordsLoading,
  } = useRecords(timeframe)
  const {
    data: unitStatus,
    handler: refreshStatus,
    loading: statusLoading,
  } = useUnitStatus()

  const timeToRender = (records: TimeRecord[]) => {
    const instant = records[records.length - 1]?.timestamp
    if (instant === undefined) {
      return "--/--/-- --:--:--"
    } else {
      return moment(instant).format(DATETIME_FORMAT)
    }
  }

  const lastStat: (stats: TimeRecord[]) => TimeRecord | undefined = (
    stats: TimeRecord[]
  ) => stats[stats.length - 1]

  useEffect(() => {
    refreshRecords()
    refreshStatus()
    setHeight(window.innerHeight)
    const refreshInterval = setInterval(() => {
      refreshRecords()
      refreshStatus()
    }, REFRESH_PERIOD_MS)
    return () => clearInterval(refreshInterval)
  }, [timeframe])

  const radioCommonProps =
    "flex justify-center uppercase font-semibold rounded-md border-2 border-solid border-black"

  return (
    <div className="flex px-8 py-6 h-full min-h-screen">
      <div className="flex flex-col max-w-15 gap-4">
        <StatusBox unitStatus={unitStatus} />
        <ValueBox
          label={"Temperature"}
          value={lastStat(records ?? [])?.temperature}
          time={timeToRender(records ?? [])}
          suffix={TEMPERATURE_SUFFIX}
        />
        <ValueBox
          label={"Humidity"}
          value={lastStat(records ?? [])?.humidity}
          time={timeToRender(records ?? [])}
          suffix={HUMIDITY_SUFFIX}
        />
        <Button
          className="flex bg-black text-white font-semibold uppercase justify-center rounded-md px-2 py-2 outline-none"
          onPress={refreshRecords}
        >
          {recordsLoading || statusLoading ? (
            <Spinner color="white" label={"loading..."} />
          ) : (
            "Refresh"
          )}
        </Button>
        <IntervalSelector
          containerStyle={"flex flex-col gap-2 py-4"}
          selected={timeframe}
          selectedItemStyle={`${radioCommonProps} text-white bg-black`}
          unselectedItemStyle={`${radioCommonProps} text-black bg-white`}
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
      <DataView records={records} height={height} />
    </div>
  )
}
