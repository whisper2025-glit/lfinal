const requestHistory = new Map<string, number[]>()

const WINDOW_MS = 10_000
const LIMIT = 10

export const rateLimit = async (identifier: string) => {
  const now = Date.now()
  const timestamps = requestHistory.get(identifier) ?? []
  const recent = timestamps.filter((timestamp) => now - timestamp < WINDOW_MS)

  if (recent.length >= LIMIT) {
    requestHistory.set(identifier, recent)
    return { success: false }
  }

  recent.push(now)
  requestHistory.set(identifier, recent)
  return { success: true }
}
