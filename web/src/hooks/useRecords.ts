import { GraphInterval } from "@/enums"
import { HookResult, TimeRecord } from "@/types"
import { httpClient, momentByInterval } from "@/utils"
import moment from "moment"
import { useState } from "react"

export function useRecords(
  interval: GraphInterval
): HookResult<TimeRecord[] | undefined, unknown> {
  const [loading, setLoading] = useState(false)
  const [records, setRecords] = useState<TimeRecord[] | undefined>(undefined)
  const [error, setError] = useState<Record<string, unknown> | undefined>(
    undefined
  )

  const getRecords = () => {
    setLoading(true)
    httpClient
      .get<TimeRecord[]>("/records", {
        params: { interval: momentByInterval(interval) },
      })
      .then((res) => {
        const incomingStats: TimeRecord[] = (res.data as TimeRecord[])
          .filter((s) => s.humidity !== 0 || s.temperature !== 0)
          .sort((s1, s2) =>
            moment(s1.timestamp).isBefore(moment(s2.timestamp)) ? -1 : 1
          )
        setRecords(incomingStats)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return {
    data: records,
    error: error,
    handler: getRecords,
    loading: loading,
  }
}
