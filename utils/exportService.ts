import { Architecture } from '../store/architecture';
import { ComponentDef } from '../store/components';
import * as yaml from 'js-yaml';

export type ExportFormat = 'json' | 'yaml' | 'svg';

export interface ExportOptions {
  components?: ComponentDef[];
  format?: ExportFormat;
  filename?: string;
  svgContainer?: HTMLElement;
}

export interface ExportResult {
  data: string;
  format: ExportFormat;
  filename: string;
}

export class ExportService {
  private static readonly CURRENT_VERSION = '1.0.0';

  /**
   * Prepares a standalone architecture definition for export.
   */
  static prepareStandalone(architecture: Architecture) {
    return {
      version: this.CURRENT_VERSION,
      type: 'architecture',
      nodes: [...architecture.nodes].sort((a, b) => a.id.localeCompare(b.id)),
      connections: [...architecture.connections].sort((a, b) => {
        const aKey = `${(a as any).source || a.sourceNodeId}-${(a as any).target || a.targetNodeId}`;
        const bKey = `${(b as any).source || b.sourceNodeId}-${(b as any).target || b.targetNodeId}`;
        return aKey.localeCompare(bKey);
      })
    };
  }

  /**
   * Prepares an embedded definition (architecture + components) for export.
   */
  static prepareEmbedded(architecture: Architecture, components: ComponentDef[]) {
    const prepared = this.prepareStandalone(architecture);
    return {
      ...prepared,
      type: 'embedded',
      components: [...components].sort((a, b) => a.id.localeCompare(b.id))
    };
  }

  /**
   * Main entry point for generating exports.
   */
  static export(architecture: Architecture, options: ExportOptions = {}): ExportResult {
    const { components, format = 'json', filename = 'voice-architecture', svgContainer } = options;
    
    let data = '';
    
    if (format === 'json') {
      data = this.toJson(architecture, components);
    } else if (format === 'yaml') {
      data = this.toYaml(architecture, components);
    } else if (format === 'svg') {
      if (!svgContainer) {
        throw new Error('SVG container is required for SVG export');
      }
      const { serializeReactFlowSvg } = require('./svgExport');
      data = serializeReactFlowSvg(svgContainer);
    }
    
    return {
      data,
      format,
      filename: `${filename}.${format}`
    };
  }

  /**
   * Exports the architecture to YAML format.
   */
  static toYaml(architecture: Architecture, components?: ComponentDef[]) {
    const data = components 
      ? this.prepareEmbedded(architecture, components)
      : this.prepareStandalone(architecture);
    
    const output = yaml.dump(data, { indent: 2, skipInvalid: true });
    return output.endsWith('\n') ? output : output + '\n';
  }

  /**
   * Exports the architecture to JSON format.
   */
  static toJson(architecture: Architecture, components?: ComponentDef[]) {
    const data = components 
      ? this.prepareEmbedded(architecture, components)
      : this.prepareStandalone(architecture);
    
    return JSON.stringify(data, null, 2) + '\n';
  }
}
