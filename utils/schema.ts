export type SchemaType = 'architecture' | 'components' | 'embedded' | 'unknown';

export interface ValidationResult {
  valid: boolean;
  errors: string[];
  schemaType: SchemaType;
}

const SUPPORTED_VERSIONS = ['1.0.0'];

export function validateSchema(data: any): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: [],
    schemaType: 'unknown'
  };

  if (!data || typeof data !== 'object') {
    result.valid = false;
    result.errors.push('Invalid data format: expected an object');
    return result;
  }

  // Version check
  if (!data.version) {
    result.valid = false;
    result.errors.push('Missing "version" field');
  } else if (!SUPPORTED_VERSIONS.includes(data.version)) {
    result.valid = false;
    result.errors.push(`Unsupported schema version: ${data.version}`);
  }

  // Type check
  if (!data.type) {
    result.valid = false;
    result.errors.push('Missing "type" field');
  } else {
    result.schemaType = data.type;
  }

  if (!result.valid) return result;

  // Specific validations based on type
  switch (data.type) {
    case 'architecture':
      validateArchitecturePart(data, result);
      break;
    case 'components':
      validateComponentsPart(data, result);
      break;
    case 'embedded':
      validateArchitecturePart(data, result);
      validateComponentsPart(data, result);
      break;
    default:
      result.valid = false;
      result.errors.push(`Unknown schema type: ${data.type}`);
  }

  return result;
}

function validateArchitecturePart(data: any, result: ValidationResult) {
  if (!data.nodes || !Array.isArray(data.nodes)) {
    result.valid = false;
    result.errors.push('Missing "nodes" field');
  } else {
    data.nodes.forEach((node: any, idx: number) => {
      const id = node.id || `node-${idx}`;
      if (!node.id || !node.type || !node.label || !node.position) {
        result.valid = false;
        result.errors.push(`Node "${id}" is missing required fields (id, type, label, position)`);
      }
    });
  }

  if (!data.connections || !Array.isArray(data.connections)) {
    result.valid = false;
    result.errors.push('Missing "connections" field');
  } else {
    data.connections.forEach((conn: any, idx: number) => {
      const id = conn.id || `conn-${idx}`;
      if (!conn.id || !conn.sourceNodeId || !conn.sourceSocketId || !conn.targetNodeId || !conn.targetSocketId) {
        result.valid = false;
        result.errors.push(`Connection "${id}" is missing required fields (id, sourceNodeId, sourceSocketId, targetNodeId, targetSocketId)`);
      }
    });
  }
}

function validateComponentsPart(data: any, result: ValidationResult) {
  if (!data.components || !Array.isArray(data.components)) {
    result.valid = false;
    result.errors.push('Missing "components" field');
  } else {
    data.components.forEach((comp: any, idx: number) => {
      const id = comp.id || `comp-${idx}`;
      if (!comp.id || !comp.type || !comp.label || !comp.description || comp.cost === undefined || comp.latency === undefined || !comp.sockets) {
        result.valid = false;
        result.errors.push(`Component "${id}" is missing required fields`);
      } else {
        comp.sockets.forEach((socket: any, sIdx: number) => {
          const sId = socket.id || `socket-${sIdx}`;
          if (!socket.id || !socket.type || !socket.direction) {
            result.valid = false;
            result.errors.push(`Component "${id}" has invalid socket "${sId}"`);
          }
        });
      }
    });
  }
}
