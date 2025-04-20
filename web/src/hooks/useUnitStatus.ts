import { HookResult, UnitConnectionStatus } from "@/types"
import { httpClient } from "@/utils"
import { useState } from "react"

export function useUnitStatus(): HookResult<
  UnitConnectionStatus | undefined,
  unknown
> {
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<UnitConnectionStatus | undefined>(
    undefined
  )
  const [error, setError] = useState<Record<string, unknown> | undefined>(
    undefined
  )

  const getRecords = () => {
    setLoading(true)
    httpClient
      .get<UnitConnectionStatus>("/status")
      .then((res) => {
        setStatus(res.data)
      })
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return {
    data: status,
    error: error,
    handler: getRecords,
    loading: loading,
  }
}
