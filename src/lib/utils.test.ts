import { describe, it, expect } from 'vitest'
import { cn, generateId, truncateText, countWords } from './utils'

describe('utils', () => {
  describe('cn', () => {
    it('should merge class names', () => {
      const result = cn('base-class', 'additional-class')
      expect(result).toContain('base-class')
      expect(result).toContain('additional-class')
    })

    it('should handle conditional classes', () => {
      const result = cn('base', false && 'conditional', true && 'included')
      expect(result).toContain('base')
      expect(result).toContain('included')
      expect(result).not.toContain('conditional')
    })

    it('should merge tailwind classes correctly', () => {
      const result = cn('p-4', 'p-2')
      expect(result).toBe('p-2')
    })

    it('should handle undefined and null', () => {
      const result = cn('base', undefined, null, 'other')
      expect(result).toContain('base')
      expect(result).toContain('other')
    })
  })

  describe('generateId', () => {
    it('should generate an id with the given prefix', () => {
      const id = generateId('vault')
      expect(id).toMatch(/^vault-\d+-[a-z0-9]+$/)
    })

    it('should generate unique ids', () => {
      const id1 = generateId('node')
      const id2 = generateId('node')
      expect(id1).not.toBe(id2)
    })

    it('should use the correct prefix', () => {
      expect(generateId('conn')).toMatch(/^conn-/)
      expect(generateId('vault')).toMatch(/^vault-/)
      expect(generateId('node')).toMatch(/^node-/)
    })
  })

  describe('truncateText', () => {
    it('should return original text if within maxLength', () => {
      expect(truncateText('hello', 10)).toBe('hello')
    })

    it('should truncate text exceeding maxLength', () => {
      expect(truncateText('hello world', 5)).toBe('hello…')
    })

    it('should trim trailing whitespace before appending ellipsis', () => {
      expect(truncateText('hello world test', 6)).toBe('hello…')
    })

    it('should handle empty string', () => {
      expect(truncateText('', 10)).toBe('')
    })

    it('should handle exact length', () => {
      expect(truncateText('hello', 5)).toBe('hello')
    })
  })

  describe('countWords', () => {
    it('should count words in a string', () => {
      expect(countWords('hello world')).toBe(2)
    })

    it('should return 0 for empty string', () => {
      expect(countWords('')).toBe(0)
    })

    it('should return 0 for whitespace-only string', () => {
      expect(countWords('   ')).toBe(0)
    })

    it('should handle multiple spaces between words', () => {
      expect(countWords('hello   world   test')).toBe(3)
    })

    it('should handle single word', () => {
      expect(countWords('hello')).toBe(1)
    })
  })
})
