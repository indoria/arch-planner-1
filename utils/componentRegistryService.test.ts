import { ComponentRegistryService } from './componentRegistryService'

describe('ComponentRegistryService', () => {
  const originalFetch = global.fetch

  beforeEach(() => {
    jest.clearAllMocks()
  })

  afterEach(() => {
    global.fetch = originalFetch
  })

  const mockComponent = {
    id: 1,
    name: 'Custom Whisper Node',
    type: 'stt',
    ownerId: 1,
    data: {
      label: 'Custom Whisper Node',
      type: 'stt',
      description: 'Fine-tuned whisper node',
      cost: 0.005,
      latency: 200,
      sockets: []
    }
  }

  describe('getComponents', () => {
    it('fetches components from /components with auth token and query params', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => [mockComponent]
      }) as any

      const result = await ComponentRegistryService.getComponents({
        token: 'token-123',
        type: 'stt',
        search: 'whisper',
        apiBaseUrl: 'http://localhost:3001'
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/components?type=stt&search=whisper',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-123'
          })
        })
      )
      expect(result).toEqual([mockComponent])
    })

    it('throws error when fetch fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({ error: 'Internal server error' })
      }) as any

      await expect(
        ComponentRegistryService.getComponents({ token: 'bad' })
      ).rejects.toThrow('Internal server error')
    })
  })

  describe('getComponentById', () => {
    it('fetches single component by id', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockComponent
      }) as any

      const result = await ComponentRegistryService.getComponentById(1, {
        token: 'token-123',
        apiBaseUrl: 'http://localhost:3001'
      })

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/components/1',
        expect.objectContaining({
          method: 'GET',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-123'
          })
        })
      )
      expect(result).toEqual(mockComponent)
    })
  })

  describe('publishComponent', () => {
    it('posts component data to /components', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: true,
        json: async () => mockComponent
      }) as any

      const result = await ComponentRegistryService.publishComponent(
        {
          name: 'Custom Whisper Node',
          type: 'stt',
          data: mockComponent.data
        },
        {
          token: 'token-123',
          apiBaseUrl: 'http://localhost:3001'
        }
      )

      expect(global.fetch).toHaveBeenCalledWith(
        'http://localhost:3001/components',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            Authorization: 'Bearer token-123',
            'Content-Type': 'application/json'
          }),
          body: JSON.stringify({
            name: 'Custom Whisper Node',
            type: 'stt',
            data: mockComponent.data
          })
        })
      )
      expect(result).toEqual(mockComponent)
    })

    it('throws error when publication fails', async () => {
      global.fetch = jest.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({ error: 'Component data is required' })
      }) as any

      await expect(
        ComponentRegistryService.publishComponent(
          { name: 'Invalid', type: 'stt', data: null },
          { token: 'token-123' }
        )
      ).rejects.toThrow('Component data is required')
    })
  })
})
