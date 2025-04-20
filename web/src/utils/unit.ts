import { UnitStatus } from "@/enums"
import { TimeRecord } from "@/types"
import moment from "moment"

export const unitStatus = (stat: TimeRecord) => {
  const offlineThreshold = moment.duration(1, "minute")
  const lastUpdate = moment(stat.timestamp)
  return moment().subtract(offlineThreshold).isBefore(lastUpdate)
    ? UnitStatus.ONLINE
    : UnitStatus.OFFLINE
}
