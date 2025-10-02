export type MessageRole = 'system' | 'user'

export interface StoredMessage {
  id: string
  role: MessageRole
  content: string
  createdAt: string
  userId?: string
}

export interface Category {
  id: string
  name: string
}

export interface Companion {
  id: string
  name: string
  description: string
  instructions: string
  seed: string
  src: string
  categoryId: string
  userId: string
  userName: string
  createdAt: string
  messages: StoredMessage[]
}
