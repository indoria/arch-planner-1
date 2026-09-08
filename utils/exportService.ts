import { Architecture } from '../store/architecture';
import { ComponentDef } from '../store/components';
import yaml from 'js-yaml';

export class ExportService {
  private static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Prepares a standalone architecture definition for export.
   */
  static prepareStandalone(architecture: Architecture) {
    return {
      version: this.CURRENT_VERSION,
      type: 'architecture',
      nodes: architecture.nodes,
      connections: architecture.connections
    };
  }

  /**
   * Prepares an embedded definition (architecture + components) for export.
   */
  static prepareEmbedded(architecture: Architecture, components: ComponentDef[]) {
    return {
      version: this.CURRENT_VERSION,
      type: 'embedded',
      nodes: architecture.nodes,
      connections: architecture.connections,
      components: components
    };
  }

  /**
   * Exports the architecture to YAML format.
   */
  static toYaml(architecture: Architecture, components?: ComponentDef[]) {
    const data = components 
      ? this.prepareEmbedded(architecture, components)
      : this.prepareStandalone(architecture);
    
    return yaml.dump(data, { indent: 2, skipInvalid: true });
  }
}
