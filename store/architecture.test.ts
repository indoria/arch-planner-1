import { Socket, validateSocket, validateConnection, validateArchitecture } from './architecture'

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

  describe('validateArchitecture (Recursive)', () => {
    it('should validate an architecture with sub-architectures', () => {
      const subArch = {
        nodes: [
          { id: 'sn1', type: 'architectureNode', label: 'Sub Node', sockets: [], position: { x: 0, y: 0 }, data: {} }
        ],
        connections: []
      }

      const mainArch = {
        nodes: [
          { 
            id: 'n1', 
            type: 'architectureNode', 
            label: 'Parent Node', 
            sockets: [], 
            position: { x: 0, y: 0 }, 
            data: {},
            subArchitecture: subArch 
          }
        ],
        connections: []
      }

      expect(validateArchitecture(mainArch)).toBe(true)
    })

    it('should detect circular sub-architecture references', () => {
      const archA: any = {
        nodes: [
          { id: 'n1', type: 'architectureNode', label: 'Node 1', sockets: [], position: { x: 0, y: 0 }, data: {} }
        ],
        connections: []
      }

      const archB: any = {
        nodes: [
          { id: 'n2', type: 'architectureNode', label: 'Node 2', sockets: [], position: { x: 0, y: 0 }, data: {}, subArchitecture: archA }
        ],
        connections: []
      }

      // Create a cycle: A -> B -> A
      archA.nodes[0].subArchitecture = archB

      expect(validateArchitecture(archA)).toBe(false)
    })

    it('should handle invalid architecture input', () => {
      expect(validateArchitecture(null as any)).toBe(false)
      expect(validateArchitecture('not an arch' as any)).toBe(false)
    })
  })
})
