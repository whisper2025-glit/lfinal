import { randomUUID } from 'crypto'

import type {
  Category,
  Companion,
  MessageRole,
  StoredMessage,
} from '@/types/companion'

const defaultUserId = 'local-user'
const defaultUserName = 'Local Admin'

const categories: Category[] = [
  { id: 'creators', name: 'Creators' },
  { id: 'innovators', name: 'Innovators' },
  { id: 'mentors', name: 'Mentors' },
]

const companions: Companion[] = [
  {
    id: 'visionary-mentor',
    name: 'Visionary Mentor',
    description: 'Forward-looking advisor focused on bold ideas.',
    instructions:
      'You are a visionary mentor who speaks with optimism and clarity. Offer practical guidance while keeping conversations encouraging.',
    seed:
      'Human: I feel stuck on my project.\nMentor: Describe the challenge and let us map a path forward together.',
    src: '/placeholder.svg',
    categoryId: 'mentors',
    userId: defaultUserId,
    userName: defaultUserName,
    createdAt: new Date().toISOString(),
    messages: [
      {
        id: randomUUID(),
        role: 'system',
        content:
          'Hello, I am Visionary Mentor. I thrive on helping you explore ambitious ideas with grounded next steps.',
        createdAt: new Date().toISOString(),
        userId: defaultUserId,
      },
    ],
  },
  {
    id: 'creative-companion',
    name: 'Creative Companion',
    description: 'Brainstorm partner for imaginative storytelling.',
    instructions:
      'You collaborate on storytelling with curiosity and playful language. Ask clarifying questions and suggest vivid possibilities.',
    seed:
      'Human: I need a story hook.\nCompanion: What genre inspires you? Together we can sketch a compelling opening scene.',
    src: '/placeholder.svg',
    categoryId: 'creators',
    userId: defaultUserId,
    userName: defaultUserName,
    createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    messages: [
      {
        id: randomUUID(),
        role: 'system',
        content:
          'Hello, I am Creative Companion. I love spinning imaginative tales and exploring colorful ideas together.',
        createdAt: new Date().toISOString(),
        userId: defaultUserId,
      },
    ],
  },
]

const cloneCategory = (category: Category): Category => ({ ...category })

const cloneMessage = (message: StoredMessage): StoredMessage => ({ ...message })

const cloneCompanion = (companion: Companion): Companion => ({
  ...companion,
  messages: companion.messages.map(cloneMessage),
})

const ensureCategoryExists = (categoryId: string) => {
  const exists = categories.some((category) => category.id === categoryId)
  if (!exists) {
    throw new Error('Category not found')
  }
}

export interface CompanionFilters {
  categoryId?: string
  name?: string
}

export interface CompanionPayload {
  name: string
  description: string
  instructions: string
  seed: string
  src: string
  categoryId: string
}

export const listCategories = (): Category[] =>
  categories.map((category) => cloneCategory(category))

export const listCompanions = (filters: CompanionFilters = {}): Companion[] => {
  const { categoryId, name } = filters

  const filtered = companions.filter((companion) => {
    if (categoryId && companion.categoryId !== categoryId) {
      return false
    }

    if (name && name.trim().length > 0) {
      const value = name.trim().toLowerCase()
      const matchesName = companion.name.toLowerCase().includes(value)
      const matchesDescription = companion.description
        .toLowerCase()
        .includes(value)
    // include instructions search for better coverage
      const matchesInstructions = companion.instructions
        .toLowerCase()
        .includes(value)

      if (!matchesName && !matchesDescription && !matchesInstructions) {
        return false
      }
    }

    return true
  })

  return filtered
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .map((companion) => cloneCompanion(companion))
}

export const getCompanionById = (id: string): Companion | undefined => {
  const companion = companions.find((item) => item.id === id)
  if (!companion) {
    return undefined
  }

  return cloneCompanion(companion)
}

export const createCompanion = (payload: CompanionPayload): Companion => {
  ensureCategoryExists(payload.categoryId)

  const now = new Date().toISOString()
  const companion: Companion = {
    id: randomUUID(),
    createdAt: now,
    messages: [],
    userId: defaultUserId,
    userName: defaultUserName,
    ...payload,
  }

  companions.push(companion)

  return cloneCompanion(companion)
}

export const updateCompanion = (
  id: string,
  payload: CompanionPayload,
): Companion => {
  ensureCategoryExists(payload.categoryId)

  const index = companions.findIndex((item) => item.id === id)

  if (index === -1) {
    throw new Error('Companion not found')
  }

  companions[index] = {
    ...companions[index],
    ...payload,
  }

  return cloneCompanion(companions[index])
}

export const deleteCompanion = (id: string): void => {
  const index = companions.findIndex((item) => item.id === id)
  if (index === -1) {
    throw new Error('Companion not found')
  }

  companions.splice(index, 1)
}

export const appendMessage = (
  companionId: string,
  message: { content: string; role: MessageRole; userId?: string },
): StoredMessage => {
  const index = companions.findIndex((item) => item.id === companionId)

  if (index === -1) {
    throw new Error('Companion not found')
  }

  const createdMessage: StoredMessage = {
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    role: message.role,
    content: message.content,
    userId: message.userId ?? 'guest-user',
  }

  companions[index].messages = [...companions[index].messages, createdMessage]

  return cloneMessage(createdMessage)
}
