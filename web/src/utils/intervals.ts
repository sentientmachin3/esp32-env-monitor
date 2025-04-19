import { GraphInterval } from "@/enums"

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
