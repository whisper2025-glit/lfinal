import type { StoredMessage } from '@/types/companion'

export type CompanionKey = {
  companionName: string
  modelName: string
  userId: string
}

type CompanionHistory = StoredMessage[]

const histories = new Map<string, CompanionHistory>()

const generateKey = (key: CompanionKey) =>
  `${key.companionName}-${key.modelName}-${key.userId}`

export class MemoryManager {
  private static instance: MemoryManager

  public static async getInstance(): Promise<MemoryManager> {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager()
    }

    return MemoryManager.instance
  }

  public async writeToHistory(text: string, companionKey: CompanionKey) {
    const key = generateKey(companionKey)
    const history = histories.get(key) ?? []

    history.push({
      id: `${key}-${history.length}`,
      role: 'system',
      content: text,
      createdAt: new Date().toISOString(),
      userId: companionKey.userId,
    })

    histories.set(key, history)
  }

  public async readLatestHistory(companionKey: CompanionKey): Promise<string> {
    const key = generateKey(companionKey)
    const history = histories.get(key) ?? []
    const recent = history.slice(-30)
    return recent.map((entry) => entry.content).join('\n')
  }

  public async seedChatHistory(
    seedContent: string,
    delimiter = '\n',
    companionKey: CompanionKey,
  ) {
    const key = generateKey(companionKey)
    if (histories.has(key)) {
      return
    }

    const content = seedContent.split(delimiter).filter((line) => line.trim())
    histories.set(
      key,
      content.map((line, index) => ({
        id: `${key}-seed-${index}`,
        role: 'system',
        content: line,
        createdAt: new Date().toISOString(),
        userId: companionKey.userId,
      })),
    )
  }

  public async vectorSearch() {
    return [] as { pageContent: string }[]
  }
}
