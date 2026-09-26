import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database
jest.unstable_mockModule('../prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        User: {
          first: jest.fn(),
          all: jest.fn(),
          where: jest.fn().mockReturnThis(),
        },
        Architecture: {
          where: jest.fn().mockReturnThis(),
          first: jest.fn(),
          all: jest.fn(),
          create: jest.fn(),
          update: jest.fn(),
          delete: jest.fn(),
        }
      }
    }
  }
}));

// Dynamically import app and db mock
const { default: app } = await import('./app.js');
const { db } = await import('../prisma/db.js');

describe('Architecture CRUD API & Schema Validation', () => {
  const validDefinition = {
    version: '1.0.0',
    type: 'architecture',
    nodes: [
      {
        id: 'node-1',
        type: 'vad',
        label: 'Voice Activity Detector',
        position: { x: 100, y: 100 }
      }
    ],
    connections: [
      {
        id: 'conn-1',
        sourceNodeId: 'node-1',
        sourceSocketId: 'out',
        targetNodeId: 'node-2',
        targetSocketId: 'in'
      }
    ]
  };

  const validArchPayload = {
    name: 'Voicebot Architecture',
    description: 'Production voicebot flow',
    isPublic: false,
    definition: validDefinition
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /architectures', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app)
        .post('/architectures')
        .send(validArchPayload);

      expect(response.status).toBe(401);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({ ...validArchPayload, name: '' });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/name/i);
    });

    it('should return 400 if definition is missing', async () => {
      const response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Voicebot' });

      expect(response.status).toBe(400);
      expect(response.body.error).toMatch(/definition/i);
    });

    it('should return 400 if definition is invalid schema', async () => {
      const invalidDefinition = {
        version: '1.0.0',
        type: 'architecture',
        nodes: 'not-an-array'
      };

      const response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({ ...validArchPayload, definition: invalidDefinition });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('should return 400 if definition is not an object or has unsupported version or type', async () => {
      let response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({ ...validArchPayload, definition: 'invalid-string' });
      expect(response.status).toBe(400);

      response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({ ...validArchPayload, definition: { version: '9.9.9', type: 'architecture' } });
      expect(response.status).toBe(400);

      response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({ ...validArchPayload, definition: { version: '1.0.0', type: 'invalid-type' } });
      expect(response.status).toBe(400);
    });

    it('should return 400 if nodes or connections have missing required fields', async () => {
      let response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({
          ...validArchPayload,
          definition: {
            version: '1.0.0',
            type: 'architecture',
            nodes: [{ id: 'node-1' }],
            connections: []
          }
        });
      expect(response.status).toBe(400);

      response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send({
          ...validArchPayload,
          definition: {
            version: '1.0.0',
            type: 'architecture',
            nodes: validDefinition.nodes,
            connections: [{ id: 'conn-1' }]
          }
        });
      expect(response.status).toBe(400);
    });

    it('should create an architecture and return 201 when valid', async () => {
      const createdArch = {
        id: 101,
        ...validArchPayload,
        ownerId: 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      (db.orm.public.Architecture.create as jest.Mock).mockResolvedValue(createdArch);

      const response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send(validArchPayload);

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(101);
      expect(response.body.name).toBe('Voicebot Architecture');
      expect(db.orm.public.Architecture.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: validArchPayload.name,
            ownerId: 1
          })
        })
      );
    });

    it('should return 500 if database creation fails', async () => {
      (db.orm.public.Architecture.create as jest.Mock).mockRejectedValue(new Error('DB failure'));

      const response = await request(app)
        .post('/architectures')
        .set('Authorization', 'Bearer valid-token')
        .send(validArchPayload);

      expect(response.status).toBe(500);
      expect(response.body.error).toBe('Internal server error');
    });
  });

  describe('GET /architectures', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/architectures');
      expect(response.status).toBe(401);
    });

    it('should return 200 and list of user architectures', async () => {
      const mockList = [
        { id: 101, name: 'Arch 1', ownerId: 1, isPublic: false },
        { id: 102, name: 'Arch 2', ownerId: 1, isPublic: true }
      ];

      (db.orm.public.Architecture.all as jest.Mock).mockResolvedValue(mockList);

      const response = await request(app)
        .get('/architectures')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockList);
    });

    it('should return 500 if database fetch fails', async () => {
      (db.orm.public.Architecture.all as jest.Mock).mockRejectedValue(new Error('DB query error'));

      const response = await request(app)
        .get('/architectures')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(500);
    });
  });

  describe('PUT /architectures/:id with Schema Validation', () => {
    const existingArch = { id: 101, name: 'Old Arch', ownerId: 1, isPublic: false, definition: validDefinition };

    it('should return 400 if updated definition is invalid schema', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(existingArch)
      });

      const response = await request(app)
        .put('/architectures/101')
        .set('Authorization', 'Bearer valid-token')
        .send({
          definition: { invalid: true }
        });

      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });
  });
});
