export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

const SUPPORTED_VERSIONS = ['1.0.0'];

export function validateArchitectureDefinition(data: any): ValidationResult {
  const result: ValidationResult = {
    valid: true,
    errors: []
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
  } else if (data.type !== 'architecture' && data.type !== 'embedded') {
    result.valid = false;
    result.errors.push(`Expected architecture schema type, got: ${data.type}`);
  }

  // Nodes check
  if (!data.nodes || !Array.isArray(data.nodes)) {
    result.valid = false;
    result.errors.push('Missing or invalid "nodes" field (expected array)');
  } else {
    data.nodes.forEach((node: any, idx: number) => {
      const id = node?.id || `node-${idx}`;
      if (!node || !node.id || !node.type || !node.label || !node.position) {
        result.valid = false;
        result.errors.push(`Node "${id}" is missing required fields (id, type, label, position)`);
      }
    });
  }

  // Connections check
  if (!data.connections || !Array.isArray(data.connections)) {
    result.valid = false;
    result.errors.push('Missing or invalid "connections" field (expected array)');
  } else {
    data.connections.forEach((conn: any, idx: number) => {
      const id = conn?.id || `conn-${idx}`;
      if (
        !conn ||
        !conn.id ||
        !conn.sourceNodeId ||
        !conn.sourceSocketId ||
        !conn.targetNodeId ||
        !conn.targetSocketId
      ) {
        result.valid = false;
        result.errors.push(`Connection "${id}" is missing required fields`);
      }
    });
  }

  return result;
}
