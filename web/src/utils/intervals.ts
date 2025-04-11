import { GraphInterval } from "@/enums"
import moment from "moment"

export function samplingInterval(interval: GraphInterval): moment.Duration {
  switch (interval) {
    case GraphInterval.ONE_MONTH:
      return moment.duration(1, "day")
    case GraphInterval.ONE_WEEK:
      return moment.duration(1, "hour")
    case GraphInterval.TWO_WEEKS:
      return moment.duration(6, "hours")
    case GraphInterval.ONE_DAY:
      return moment.duration(30, "minutes")
    case GraphInterval.HALF_HOUR:
      return moment.duration(1, "minute")
    default:
      return moment.duration(1, "minute")
  }
}

export function momentByInterval(interval: GraphInterval): string {
  switch (interval) {
    case GraphInterval.ONE_MONTH:
      return "1M"
    case GraphInterval.ONE_WEEK:
      return "1w"
    case GraphInterval.TWO_WEEKS:
      return "2w"
    case GraphInterval.ONE_DAY:
      return "1d"
    case GraphInterval.HALF_HOUR:
      return "30m"
    default:
      return "30m"
  }
}
