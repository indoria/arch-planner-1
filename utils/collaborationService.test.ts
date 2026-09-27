import { CollaborationService } from './collaborationService'

describe('CollaborationService', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  describe('buildShareUrl', () => {
    it('constructs a shareable URL given an architecture ID', () => {
      const url = CollaborationService.buildShareUrl(101, 'https://example.com')
      expect(url).toBe('https://example.com/architectures/share/101')
    })

    it('defaults to relative or origin if baseUrl is not provided', () => {
      const url = CollaborationService.buildShareUrl('arch-123')
      expect(url).toContain('/architectures/share/arch-123')
    })
  })

  describe('shareArchitecture', () => {
    it('sends POST to /architectures/:id/share with auth token', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => ({
          shareUrl: '/architectures/share/101',
          isPublic: true,
          shareId: 101
        })
      }) as any

      const result = await CollaborationService.shareArchitecture(101, {
        token: 'valid-token',
        apiBaseUrl: 'http://localhost:3001'
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/architectures/101/share',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token'
          })
        })
      )
      expect(result.shareUrl).toBe('/architectures/share/101')
      expect(result.isPublic).toBe(true)
    })

    it('throws error if share request fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({ error: 'Forbidden' })
      }) as any

      await expect(
        CollaborationService.shareArchitecture(101, { token: 'bad-token' })
      ).rejects.toThrow('Forbidden')
    })
  })

  describe('cloneArchitecture', () => {
    it('sends POST to /architectures/:id/clone with optional custom name', async () => {
      const clonedData = {
        id: 202,
        name: 'Cloned Pipeline',
        isPublic: false
      }

      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => clonedData
      }) as any

      const result = await CollaborationService.cloneArchitecture(101, {
        token: 'valid-token',
        name: 'Cloned Pipeline',
        apiBaseUrl: 'http://localhost:3001'
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/architectures/101/clone',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer valid-token',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({ name: 'Cloned Pipeline' })
        })
      )
      expect(result).toEqual(clonedData)
    })

    it('throws error if clone request fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 404,
        json: async () => ({ error: 'Architecture not found' })
      }) as any

      await expect(
        CollaborationService.cloneArchitecture(999, { token: 'valid-token' })
      ).rejects.toThrow('Architecture not found')
    })
  })
})
