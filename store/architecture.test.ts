import { Socket, validateSocket, validateConnection } from './architecture'

describe('Architecture Schema Validation', () => {
  describe('validateSocket', () => {
    it('should validate that a socket has a type and direction', () => {
      const validSocket: Socket = { id: 's1', type: 'audio', direction: 'input' }
      const invalidSocket = { id: 's2' } as any
      const nonObjectSocket = null as any

      expect(validateSocket(validSocket)).toBe(true)
      expect(validateSocket(invalidSocket)).toBe(false)
      expect(validateSocket(nonObjectSocket)).toBe(false)
      expect(validateSocket('not a socket')).toBe(false)
    })
  })

  describe('validateConnection', () => {
    it('should validate compatible socket types', () => {
      const sourceSocket: Socket = { id: 's1', type: 'audio', direction: 'output' }
      const targetSocket: Socket = { id: 's2', type: 'audio', direction: 'input' }
      const incompatibleSocket: Socket = { id: 's3', type: 'text', direction: 'input' }

      expect(validateConnection(sourceSocket, targetSocket)).toBe(true)
      expect(validateConnection(sourceSocket, incompatibleSocket)).toBe(false)
    })

    it('should validate connection direction', () => {
      const outputSocket: Socket = { id: 's1', type: 'audio', direction: 'output' }
      const inputSocket: Socket = { id: 's2', type: 'audio', direction: 'input' }

      expect(validateConnection(outputSocket, inputSocket)).toBe(true)
      expect(validateConnection(inputSocket, outputSocket)).toBe(false) // Input to Output not allowed
    })
  })
})
