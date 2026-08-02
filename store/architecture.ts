export type SocketType = 'audio' | 'text' | 'json' | 'binary'
export type SocketDirection = 'input' | 'output'

export interface Socket {
  id: string
  type: SocketType
  direction: SocketDirection
  label?: string
}

export interface TypedConnection {
  id: string
  sourceNodeId: string
  sourceSocketId: string
  targetNodeId: string
  targetSocketId: string
}

export interface Node {
  id: string
  type: string
  label: string
  sockets: Socket[]
  position: { x: number, y: number }
  data: any
  subArchitecture?: Architecture
}

export interface Architecture {
  nodes: Node[]
  connections: TypedConnection[]
}

export interface CompatibilityList {
  type: SocketType
  compatibleWith: SocketType[]
}

export const validateSocket = (socket: any): boolean => {
  if (!socket || typeof socket !== 'object') return false
  return !!(socket.id && socket.type && socket.direction)
}

export const validateConnection = (source: Socket, target: Socket): boolean => {
  // Must be output -> input
  if (source.direction !== 'output' || target.direction !== 'input') {
    return false
  }
  // Types must match (simplification for now, could use CompatibilityList)
  return source.type === target.type
}

export const validateArchitecture = (arch: Architecture, seenArches: Set<Architecture> = new Set()): boolean => {
  if (!arch || typeof arch !== 'object') return false
  if (seenArches.has(arch)) return false // Circular reference
  
  seenArches.add(arch)

  for (const node of arch.nodes) {
    if (node.subArchitecture) {
      if (!validateArchitecture(node.subArchitecture, seenArches)) {
        return false
      }
    }
  }

  return true
}
