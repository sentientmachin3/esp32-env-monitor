import { UnitStatus } from "@/enums"

export type UnitConnectionStatus = {
  unitStatus: UnitStatus
  lastUpdate?: string
}
