/**
 * High-resolution SVG export utility for ReactFlow diagrams.
 */
export function serializeReactFlowSvg(container: HTMLElement): string {
  // 1. Find the SVG element
  const originalSvg = container.querySelector('svg.react-flow__renderer') as SVGSVGElement;
  if (!originalSvg) {
    throw new Error('Could not find ReactFlow SVG renderer');
  }

  // 2. Clone the SVG so we don't modify the live DOM
  const svg = originalSvg.cloneNode(true) as SVGSVGElement;

  // 3. Remove unwanted elements
  const background = svg.querySelector('.react-flow__background');
  if (background) {
    background.remove();
  }

  const minimap = svg.querySelector('.react-flow__minimap');
  if (minimap) {
    minimap.remove();
  }

  // 4. Clean up the container's controls (they are usually divs outside the SVG, but just in case)
  // Our test puts them in the container, not the SVG, so we don't need to do anything to the SVG here
  // for controls if they are not inside it.

  // 5. Reset viewport transform
  const viewport = svg.querySelector('.react-flow__viewport') as SVGGElement;
  if (viewport) {
    viewport.removeAttribute('transform');
  }

  // 6. Ensure namespaces
  if (!svg.getAttribute('xmlns')) {
    svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  }
  if (!svg.getAttribute('xmlns:xlink')) {
    svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink');
  }

  // 7. Serialize to string
  const serializer = new XMLSerializer();
  let source = serializer.serializeToString(svg);

  // 8. Add XML declaration
  if (!source.startsWith('<?xml')) {
    source = '<?xml version="1.0" standalone="no"?>\r\n' + source;
  }

  return source;
}
