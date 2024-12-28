import { UnitStatus } from "@/enums"

export type UnitConnectionStatus = {
  status: UnitStatus
  lastUpdate?: number
}
