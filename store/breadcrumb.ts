import { Architecture } from './architecture'

export const getBreadcrumbPath = (rootArch: Architecture, targetArch: Architecture, path: string[] = []): string[] | null => {
    // If the root arch is the target arch, we found it!
    if (rootArch === targetArch) {
        return path
    }
    
    // Search through nodes for sub-architectures
    for (const node of rootArch.nodes) {
        if (node.subArchitecture) {
            const result = getBreadcrumbPath(node.subArchitecture, targetArch, [...path, node.label])
            if (result) {
                return result
            }
        }
    }
    
    return null
}
