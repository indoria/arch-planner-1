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
        Component: {
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

describe('Shared Component Registry API', () => {
  const mockComponent = {
    id: 1,
    name: 'Whisper Large v3',
    type: 'stt',
    ownerId: 1,
    data: {
      label: 'Whisper Large v3',
      description: 'OpenAI high-accuracy speech-to-text model',
      type: 'stt',
      cost: 0.006,
      latency: 220,
      sockets: [
        { id: 'audio_in', type: 'audio', direction: 'input' },
        { id: 'text_out', type: 'text', direction: 'output' }
      ]
    }
  };

  const mockComponent2 = {
    id: 2,
    name: 'Claude 3.5 Sonnet',
    type: 'llm',
    ownerId: 2,
    data: {
      label: 'Claude 3.5 Sonnet',
      description: 'High-intelligence reasoning LLM',
      type: 'llm',
      cost: 0.015,
      latency: 450,
      sockets: [
        { id: 'prompt_in', type: 'text', direction: 'input' },
        { id: 'response_out', type: 'text', direction: 'output' }
      ]
    }
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('GET /components', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/components');
      expect(response.status).toBe(401);
    });

    it('should return all components when authenticated', async () => {
      (db.orm.public.Component.all as jest.Mock).mockResolvedValue([mockComponent, mockComponent2]);

      const response = await request(app)
        .get('/components')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe('Whisper Large v3');
    });

    it('should filter components by type query parameter', async () => {
      (db.orm.public.Component.all as jest.Mock).mockResolvedValue([mockComponent, mockComponent2]);

      const response = await request(app)
        .get('/components?type=stt')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].type).toBe('stt');
    });

    it('should filter components by search term across name and description', async () => {
      (db.orm.public.Component.all as jest.Mock).mockResolvedValue([mockComponent, mockComponent2]);

      const response = await request(app)
        .get('/components?search=sonnet')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
      expect(response.body[0].name).toBe('Claude 3.5 Sonnet');
    });
  });

  describe('GET /components/:id', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).get('/components/1');
      expect(response.status).toBe(401);
    });

    it('should return 404 if component not found', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(null)
      });

      const response = await request(app)
        .get('/components/999')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });

    it('should return component by id', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(mockComponent)
      });

      const response = await request(app)
        .get('/components/1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.id).toBe(1);
      expect(response.body.name).toBe('Whisper Large v3');
    });
  });

  describe('POST /components', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).post('/components').send(mockComponent);
      expect(response.status).toBe(401);
    });

    it('should return 400 if name is missing', async () => {
      const response = await request(app)
        .post('/components')
        .set('Authorization', 'Bearer valid-token')
        .send({ type: 'stt', data: mockComponent.data });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Name is required');
    });

    it('should return 400 if type is missing', async () => {
      const response = await request(app)
        .post('/components')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'My Component', data: mockComponent.data });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Type is required');
    });

    it('should return 400 if data is missing or invalid', async () => {
      const response = await request(app)
        .post('/components')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'My Component', type: 'stt' });

      expect(response.status).toBe(400);
      expect(response.body.error).toBe('Component data is required');
    });

    it('should publish a component and return 201', async () => {
      (db.orm.public.Component.create as jest.Mock).mockResolvedValue(mockComponent);

      const response = await request(app)
        .post('/components')
        .set('Authorization', 'Bearer valid-token')
        .send({
          name: 'Whisper Large v3',
          type: 'stt',
          data: mockComponent.data
        });

      expect(response.status).toBe(201);
      expect(response.body.name).toBe('Whisper Large v3');
      expect(db.orm.public.Component.create).toHaveBeenCalledWith(
        expect.objectContaining({
          data: expect.objectContaining({
            name: 'Whisper Large v3',
            type: 'stt',
            ownerId: 1
          })
        })
      );
    });
  });

  describe('PUT /components/:id', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).put('/components/1').send({ name: 'Updated' });
      expect(response.status).toBe(401);
    });

    it('should return 404 if component not found', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(null)
      });

      const response = await request(app)
        .put('/components/999')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Updated' });

      expect(response.status).toBe(404);
    });

    it('should return 403 if user is not the owner', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(mockComponent2) // owned by user 2
      });

      const response = await request(app)
        .put('/components/2')
        .set('Authorization', 'Bearer valid-token') // authenticated as user 1
        .send({ name: 'Updated' });

      expect(response.status).toBe(403);
    });

    it('should update component if user is owner', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(mockComponent)
      });
      (db.orm.public.Component.update as jest.Mock).mockResolvedValue({
        ...mockComponent,
        name: 'Whisper Large v3 (Updated)'
      });

      const response = await request(app)
        .put('/components/1')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Whisper Large v3 (Updated)' });

      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Whisper Large v3 (Updated)');
    });
  });

  describe('DELETE /components/:id', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).delete('/components/1');
      expect(response.status).toBe(401);
    });

    it('should return 404 if component not found', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(null)
      });

      const response = await request(app)
        .delete('/components/999')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });

    it('should return 403 if user is not the owner', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(mockComponent2)
      });

      const response = await request(app)
        .delete('/components/2')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(403);
    });

    it('should delete component and return 204 if user is owner', async () => {
      (db.orm.public.Component.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(mockComponent)
      });
      (db.orm.public.Component.delete as jest.Mock).mockResolvedValue(mockComponent);

      const response = await request(app)
        .delete('/components/1')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(204);
      expect(db.orm.public.Component.delete).toHaveBeenCalledWith({
        where: { id: 1 }
      });
    });
  });
});
