import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import '@testing-library/jest-dom'

afterEach(() => {
  cleanup()
})

global.spark = {
  llmPrompt: (strings: TemplateStringsArray, ...values: any[]) => {
    return strings.reduce((acc, str, i) => acc + str + (values[i] || ''), '')
  },
  llm: vi.fn(async (prompt: string) => {
    return 'Mocked AI response for: ' + prompt.substring(0, 50)
  }),
  user: vi.fn(async () => ({
    avatarUrl: 'https://avatar.example.com/test.png',
    email: 'test@example.com',
    id: 'test-user-id',
    isOwner: true,
    login: 'testuser',
  })),
  kv: {
    keys: vi.fn(async () => []),
    get: vi.fn(async () => undefined),
    set: vi.fn(async () => undefined),
    delete: vi.fn(async () => undefined),
  },
}

Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})
