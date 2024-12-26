import { UnitStatus } from "@/enums"
import { Stat } from "@/types"
import moment from "moment"

export const unitStatus = (stat: Stat) => {
  const offlineThreshold = moment.duration(1, "minute")
  const lastUpdate = moment.unix(stat.timestamp)
  return moment().subtract(offlineThreshold).isBefore(lastUpdate)
    ? UnitStatus.ONLINE
    : UnitStatus.OFFLINE
}
