import { Architecture } from '../store/architecture';
import { ComponentDef } from '../store/components';
import { validateSchema } from './schema';
import { getDiagnostics, Diagnostic } from './diagnostic';

export interface LoadResult {
  success: boolean;
  architecture?: Architecture;
  components: ComponentDef[];
  diagnostics: Diagnostic[];
  errors?: string[];
}

export class UnifiedLoader {
  /**
   * Main entry point to load any supported schema type.
   */
  static async load(data: any): Promise<LoadResult> {
    const validation = validateSchema(data);
    if (!validation.valid) {
      return { success: false, components: [], diagnostics: [], errors: validation.errors };
    }

    switch (validation.schemaType) {
      case 'architecture':
        return this.loadIndependent(data, { components: [] });
      case 'components':
        return this.loadIndependent({ nodes: [], connections: [] }, data);
      case 'embedded':
        return this.loadEmbedded(data);
      default:
        return { success: false, components: [], diagnostics: [], errors: ['Unsupported schema type for unified loading'] };
    }
  }

  /**
   * Loads architecture and components from independent objects.
   */
  static async loadIndependent(archData: any, componentsData: any): Promise<LoadResult> {
    const archValidation = validateSchema(archData);
    const compValidation = validateSchema(componentsData);

    const errors: string[] = [];
    if (!archValidation.valid) errors.push(...archValidation.errors);
    if (!compValidation.valid) errors.push(...compValidation.errors);

    if (errors.length > 0) {
      return { success: false, components: [], diagnostics: [], errors };
    }

    const architecture: Architecture = {
      nodes: archData.nodes || [],
      connections: archData.connections || []
    };

    const components: ComponentDef[] = componentsData.components || [];
    const diagnostics = getDiagnostics(architecture, components);

    return {
      success: true,
      architecture,
      components,
      diagnostics
    };
  }

  /**
   * Extracts parts from an embedded definition.
   */
  static async loadEmbedded(data: any): Promise<LoadResult> {
    const validation = validateSchema(data);
    if (!validation.valid || validation.schemaType !== 'embedded') {
      return { success: false, components: [], diagnostics: [], errors: validation.errors };
    }

    const architecture: Architecture = {
      nodes: data.nodes || [],
      connections: data.connections || []
    };

    const components: ComponentDef[] = data.components || [];
    const diagnostics = getDiagnostics(architecture, components);

    return {
      success: true,
      architecture,
      components,
      diagnostics
    };
  }
}
