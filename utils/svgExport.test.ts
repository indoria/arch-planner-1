import { serializeReactFlowSvg } from './svgExport';

describe('serializeReactFlowSvg', () => {
  let container: HTMLElement;
  let svg: SVGSVGElement;
  let viewport: SVGGElement;

  beforeEach(() => {
    container = document.createElement('div');
    container.className = 'react-flow';
    
    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.classList.add('react-flow__renderer');
    
    viewport = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    viewport.classList.add('react-flow__viewport');
    viewport.setAttribute('transform', 'translate(100, 100) scale(0.5)');
    
    const nodes = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    nodes.classList.add('react-flow__nodes');
    
    // Add a dummy node
    const node = document.createElementNS('http://www.w3.org/2000/svg', 'rect');
    node.setAttribute('x', '10');
    node.setAttribute('y', '10');
    node.setAttribute('width', '100');
    node.setAttribute('height', '50');
    nodes.appendChild(node);
    
    const background = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    background.classList.add('react-flow__background');
    
    const controls = document.createElement('div');
    controls.classList.add('react-flow__controls');
    
    svg.appendChild(background);
    svg.appendChild(viewport);
    viewport.appendChild(nodes);
    container.appendChild(svg);
    container.appendChild(controls);
  });

  it('should remove background and controls', () => {
    const result = serializeReactFlowSvg(container);
    expect(result).not.toContain('react-flow__background');
    expect(result).not.toContain('react-flow__controls');
  });

  it('should include necessary namespaces', () => {
    const result = serializeReactFlowSvg(container);
    expect(result).toContain('xmlns="http://www.w3.org/2000/svg"');
    expect(result).toContain('xmlns:xlink="http://www.w3.org/1999/xlink"');
  });

  it('should include XML declaration', () => {
    const result = serializeReactFlowSvg(container);
    expect(result).toMatch(/^<\?xml version="1.0" standalone="no"\?>/);
  });

  it('should reset viewport transform in the serialized output', () => {
    const result = serializeReactFlowSvg(container);
    // The serialized viewport should not have the transform that was in the live DOM
    expect(result).toContain('class="react-flow__viewport"');
    expect(result).not.toContain('transform="translate(100, 100) scale(0.5)"');
  });
});
