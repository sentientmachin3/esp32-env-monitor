import { GraphInterval } from "@/enums"

const INTERVAL_TRANSLATIONS: Record<GraphInterval, string> = {
  [GraphInterval.ONE_DAY]: "One day",
  [GraphInterval.ONE_WEEK]: "One week",
  [GraphInterval.ONE_MONTH]: "One month",
  [GraphInterval.HALF_HOUR]: "Half hour",
  [GraphInterval.TWO_WEEKS]: "Two weeks",
}
export function IntervalSelector({
  containerStyle,
  itemStyle,
  intervals,
  onSelect,
}: {
  containerStyle: string
  itemStyle: string
  intervals: GraphInterval[]
  onSelect: (interval: GraphInterval) => void
}) {
  return (
    <div className={containerStyle}>
      {intervals.map((i) => (
        <div
          key={`interval_${i}`}
          className={`${itemStyle} cursor-pointer`}
          onClick={() => onSelect(i)}
        >
          {INTERVAL_TRANSLATIONS[i]}
        </div>
      ))}
    </div>
  )
}
