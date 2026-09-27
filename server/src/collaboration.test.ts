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

describe('Collaboration & Sharing API', () => {
  const mockUser = { id: 1, email: 'user1@example.com' };
  const privateArch = {
    id: 201,
    name: 'Private Pipeline',
    description: 'Internal flow',
    ownerId: 1,
    isPublic: false,
    definition: {
      version: '1.0.0',
      type: 'architecture',
      nodes: [{ id: 'n1', type: 'vad', label: 'VAD', position: { x: 0, y: 0 } }],
      connections: [{ id: 'c1', sourceNodeId: 'n1', sourceSocketId: 'out', targetNodeId: 'n2', targetSocketId: 'in' }]
    }
  };

  const publicArch = {
    ...privateArch,
    id: 202,
    name: 'Public Pipeline',
    isPublic: true
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /architectures/:id/share', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).post('/architectures/201/share');
      expect(response.status).toBe(401);
    });

    it('should return 404 if architecture does not exist', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(null)
      });

      const response = await request(app)
        .post('/architectures/999/share')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });

    it('should return 403 if user is not the owner', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(privateArch)
      });

      const response = await request(app)
        .post('/architectures/201/share')
        .set('Authorization', 'Bearer valid-token-2');

      expect(response.status).toBe(403);
    });

    it('should generate shareable URL and mark architecture public', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(privateArch)
      });
      (db.orm.public.Architecture.update as jest.Mock).mockResolvedValue({
        ...privateArch,
        isPublic: true
      });

      const response = await request(app)
        .post('/architectures/201/share')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(200);
      expect(response.body.shareUrl).toBe('/architectures/share/201');
      expect(response.body.isPublic).toBe(true);
      expect(db.orm.public.Architecture.update).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 201 },
          data: expect.objectContaining({ isPublic: true })
        })
      );
    });
  });

  describe('GET /architectures/share/:id', () => {
    it('should return 404 if architecture not found', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(null)
      });

      const response = await request(app).get('/architectures/share/999');
      expect(response.status).toBe(404);
    });

    it('should return 404 if architecture exists but is private', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(privateArch)
      });

      const response = await request(app).get('/architectures/share/201');
      expect(response.status).toBe(404);
    });

    it('should return the architecture if public', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(publicArch)
      });

      const response = await request(app).get('/architectures/share/202');
      expect(response.status).toBe(200);
      expect(response.body.id).toBe(202);
      expect(response.body.name).toBe('Public Pipeline');
    });
  });

  describe('POST /architectures/:id/clone', () => {
    it('should return 401 if unauthenticated', async () => {
      const response = await request(app).post('/architectures/201/clone');
      expect(response.status).toBe(401);
    });

    it('should return 404 if architecture does not exist', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(null)
      });

      const response = await request(app)
        .post('/architectures/999/clone')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(404);
    });

    it('should return 403 if user attempts to clone a private architecture they do not own', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(privateArch)
      });

      const response = await request(app)
        .post('/architectures/201/clone')
        .set('Authorization', 'Bearer valid-token-2');

      expect(response.status).toBe(403);
    });

    it('should allow user to clone their own architecture', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(privateArch)
      });

      const clonedArch = {
        id: 301,
        name: 'Private Pipeline (Clone)',
        description: privateArch.description,
        definition: privateArch.definition,
        isPublic: false,
        ownerId: 1
      };
      (db.orm.public.Architecture.create as jest.Mock).mockResolvedValue(clonedArch);

      const response = await request(app)
        .post('/architectures/201/clone')
        .set('Authorization', 'Bearer valid-token');

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(301);
      expect(response.body.name).toBe('Private Pipeline (Clone)');
      expect(response.body.ownerId).toBe(1);
    });

    it('should allow another user to clone a public architecture', async () => {
      (db.orm.public.Architecture.where as jest.Mock).mockReturnValue({
        first: jest.fn<any>().mockResolvedValue(publicArch)
      });

      const clonedArch = {
        id: 302,
        name: 'Custom Clone Name',
        description: publicArch.description,
        definition: publicArch.definition,
        isPublic: false,
        ownerId: 2
      };
      (db.orm.public.Architecture.create as jest.Mock).mockResolvedValue(clonedArch);

      const response = await request(app)
        .post('/architectures/202/clone')
        .set('Authorization', 'Bearer valid-token-2')
        .send({ name: 'Custom Clone Name' });

      expect(response.status).toBe(201);
      expect(response.body.id).toBe(302);
      expect(response.body.name).toBe('Custom Clone Name');
      expect(response.body.ownerId).toBe(2);
    });
  });
});
