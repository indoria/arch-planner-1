import { saveTabs, loadTabs } from './persistence'
import { Tab } from './useTabStore'

const mockStore: Record<string, any> = {}

const mockIDB = {
  open: jest.fn()
}

// @ts-ignore
global.indexedDB = mockIDB

const STORE_NAME = 'tabs'

describe('Persistence', () => {
  let mockRequest: any

  beforeEach(() => {
    Object.keys(mockStore).forEach(key => delete mockStore[key])
    jest.clearAllMocks()

    mockRequest = {
      onsuccess: null,
      onerror: null,
      onupgradeneeded: null,
      result: {
        objectStoreNames: { contains: () => true },
        transaction: jest.fn().mockReturnValue({
          objectStore: jest.fn().mockReturnValue({
            clear: jest.fn(),
            put: jest.fn((data) => { mockStore[data.id] = data }),
            getAll: jest.fn().mockReturnValue({
              onsuccess: null,
              result: []
            })
          }),
          oncomplete: null,
          onerror: null
        })
      }
    }
    mockIDB.open.mockReturnValue(mockRequest)
  })

  const tick = () => new Promise(resolve => setTimeout(resolve, 0))

  it('should create object store on upgrade', async () => {
    const mockDB = {
      objectStoreNames: { contains: jest.fn().mockReturnValue(false) },
      createObjectStore: jest.fn()
    }
    mockRequest.result = mockDB

    saveTabs([]) // Triggers openDB
    await tick()
    if (mockRequest.onupgradeneeded) mockRequest.onupgradeneeded()
    
    expect(mockDB.createObjectStore).toHaveBeenCalledWith(STORE_NAME, { keyPath: 'id' })
  })

  it('should save and load tabs from IndexedDB', async () => {
    const mockTabs: Tab[] = [
      { id: '1', title: 'Arch 1', content: { nodes: [], connections: [] } }
    ]

    // Mock for saveTabs
    const savePromise = saveTabs(mockTabs)
    await tick()
    if (mockRequest.onsuccess) mockRequest.onsuccess()
    await tick()
    const tx = mockRequest.result.transaction.mock.results[0].value
    if (tx.oncomplete) tx.oncomplete()
    await savePromise

    expect(mockStore['1']).toEqual(mockTabs[0])

    // Mock for loadTabs
    mockRequest.result.transaction.mockClear()
    const loadPromise = loadTabs()
    await tick()
    if (mockRequest.onsuccess) mockRequest.onsuccess()
    await tick()
    const loadTx = mockRequest.result.transaction.mock.results[0].value
    const store = loadTx.objectStore()
    const getAllReq = store.getAll.mock.results[0].value
    getAllReq.result = Object.values(mockStore)
    if (getAllReq.onsuccess) getAllReq.onsuccess()
    
    const loadedTabs = await loadPromise
    expect(loadedTabs).toEqual(mockTabs)
  })

  it('should handle database open error', async () => {
    const loadPromise = loadTabs()
    await tick()
    if (mockRequest.onerror) {
      mockRequest.error = new Error('DB Open Failed')
      mockRequest.onerror()
    }
    await expect(loadPromise).rejects.toThrow('DB Open Failed')
  })
})
