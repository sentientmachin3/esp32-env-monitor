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
  selectedItemStyle,
  unselectedItemStyle,
  intervals,
  onSelect,
  selected,
}: {
  containerStyle: string
  selectedItemStyle: string
  unselectedItemStyle: string
  intervals: GraphInterval[]
  onSelect: (interval: GraphInterval) => void
  selected: GraphInterval
}) {
  return (
    <div className={containerStyle}>
      {intervals.map((i) => (
        <label
          key={`interval_${i}`}
          className={selected === i ? selectedItemStyle : unselectedItemStyle}
        >
          <div>{INTERVAL_TRANSLATIONS[i]}</div>
          <input
            type={"radio"}
            className={`sr-only`}
            value={i}
            onChange={() => onSelect(i)}
            checked={selected === i}
          />
        </label>
      ))}
    </div>
  )
}
