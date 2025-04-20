export type HookResult<T, E = unknown> = {
  data: T
  handler: () => void
  loading: boolean
  error: E
}
