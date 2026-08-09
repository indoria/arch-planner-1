import { Architecture } from './architecture'
import { getBreadcrumbPath } from './breadcrumb'

describe('breadcrumb path generation', () => {
    it('should generate breadcrumb path for a hierarchical architecture', () => {
        const subArch: Architecture = {
            nodes: [{ id: 'sub-node', type: 'input', label: 'Sub Node', sockets: [], position: { x: 0, y: 0 }, data: {} }],
            connections: []
        }
        const rootArch: Architecture = {
            nodes: [{ id: 'root-node', type: 'container', label: 'Root Node', sockets: [], position: { x: 0, y: 0 }, data: {}, subArchitecture: subArch }],
            connections: []
        }
        
        expect(getBreadcrumbPath(rootArch, subArch)).toEqual(['Root Node'])
        expect(getBreadcrumbPath(subArch, subArch)).toEqual([])
    })
})
