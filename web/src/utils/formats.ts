import { GraphInterval } from "@/enums"
import moment from "moment"

export const DATETIME_FORMAT = "ddd, DD/MM/YY HH:mm"
export const TIME_FORMAT = "HH:mm"
export const TEMPERATURE_SUFFIX = "°C"
export const HUMIDITY_SUFFIX = "%"

export const tickFormatter = (
  interval: GraphInterval,
  value: number | string
) => {
  const timeFormatIntervals: GraphInterval[] = [GraphInterval.HALF_HOUR]
  if (timeFormatIntervals.includes(interval)) {
    return moment(Number(value)).format(TIME_FORMAT)
  }
  return moment(Number(value)).format(DATETIME_FORMAT)
}
