import { Architecture } from '../store/architecture';
import { ComponentDef } from '../store/components';

export interface Diagnostic {
  type: 'error' | 'warning';
  message: string;
  targetId?: string;
}

/**
 * Generates diagnostics for a given architecture based on a component registry.
 */
export function getDiagnostics(architecture: Architecture, components: ComponentDef[]): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const knownTypes = new Set(components.map(c => c.type));
  const connectedNodeIds = new Set<string>();

  // Track all node IDs that are part of a connection
  architecture.connections.forEach(conn => {
    connectedNodeIds.add(conn.sourceNodeId);
    connectedNodeIds.add(conn.targetNodeId);
  });

  architecture.nodes.forEach(node => {
    // Check for missing behavioral models
    if (!knownTypes.has(node.type)) {
      diagnostics.push({
        type: 'warning',
        message: `Missing behavioral model for type "${node.type}". Using default placeholder behavior.`,
        targetId: node.id
      });
    }

    // Check for isolated nodes
    if (!connectedNodeIds.has(node.id)) {
      diagnostics.push({
        type: 'warning',
        message: `Node "${node.id}" has no connections. It will not participate in simulations.`,
        targetId: node.id
      });
    }
  });

  return diagnostics;
}
