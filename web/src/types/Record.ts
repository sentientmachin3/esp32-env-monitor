export type Record = {
  id: number
  timestamp: string
  humidity: number
  temperature: number
}

export type ParsedRecord = {
  id: number
  timestamp: number
  humidity: number
  temperature: number
}
