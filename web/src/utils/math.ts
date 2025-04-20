export const avg = (values: number[]) => {
  const sum = values.reduce((partial, curr) => partial + curr, 0)
  return Math.round(sum / values.length)
}
