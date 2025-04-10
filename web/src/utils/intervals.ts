import { GraphInterval } from "@/enums"
import moment from "moment"

export function momentByInterval(interval: GraphInterval): moment.Moment {
  switch (interval) {
    case GraphInterval.ONE_MONTH:
      return moment().subtract(1, "month")
    case GraphInterval.ONE_WEEK:
      return moment().subtract(1, "week")
    case GraphInterval.TWO_WEEKS:
      return moment().subtract(2, "week")
    case GraphInterval.ONE_DAY:
      return moment().subtract(1, "day")
    case GraphInterval.HALF_HOUR:
      return moment().subtract(30, "minutes")
    default:
      return moment().subtract(30, "minutes")
  }
}
