import { describe, it, expect } from 'vitest'
import { cn } from './utils'

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
})
