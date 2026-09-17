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

describe('User Profiles & Permissions', () => {
  const mockUser = { id: 1, email: 'owner@example.com' };
  const mockArch = { id: 101, name: 'My Arch', ownerId: 1, isPublic: false };
  const publicArch = { id: 102, name: 'Public Arch', ownerId: 1, isPublic: true };

  it('should allow the owner to access their architecture', async () => {
    (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);

    const response = await request(app)
      .get('/architectures/101')
      .set('Authorization', 'Bearer valid-token'); 
    
    expect(response.status).toBe(200);
    expect(response.body.ownerId).toBe(mockUser.id);
  });

  it('should deny a non-owner from accessing a private architecture', async () => {
    (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);

    const response = await request(app)
      .get('/architectures/101')
      .set('Authorization', 'Bearer valid-token-2'); 
    
    expect(response.status).toBe(403);
    expect(response.body.error).toBe('Forbidden');
  });

  it('should allow a non-owner to access a public architecture', async () => {
    (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(publicArch);

    const response = await request(app)
      .get('/architectures/102')
      .set('Authorization', 'Bearer valid-token-2'); 
    
    expect(response.status).toBe(200);
    expect(response.body.isPublic).toBe(true);
  });

  it('should return 404 if architecture does not exist', async () => {
    (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(null);

    const response = await request(app)
      .get('/architectures/999')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(404);
  });

  it('should return 500 if database query fails', async () => {
    (db.orm.public.Architecture.first as jest.Mock).mockRejectedValue(new Error('DB Error'));

    const response = await request(app)
      .get('/architectures/101')
      .set('Authorization', 'Bearer valid-token');
    
    expect(response.status).toBe(500);
  });

  describe('Authentication', () => {
    it('should return 401 if token is missing', async () => {
      const response = await request(app)
        .get('/users');
      
      expect(response.status).toBe(401);
    });

    it('should return 401 if token is invalid', async () => {
      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer invalid-token');
      
      expect(response.status).toBe(401);
      expect(response.body.error).toBe('Invalid token');
    });
  });

  describe('Get Users', () => {
    it('should return a list of users', async () => {
      (db.orm.public.User.all as jest.Mock).mockResolvedValue([mockUser]);

      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(1);
    });

    it('should return 500 if user query fails', async () => {
      (db.orm.public.User.all as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await request(app)
        .get('/users')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(500);
    });
  });

  describe('Update Architecture', () => {
    it('should allow the owner to update their architecture', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);
      (db.orm.public.Architecture.update as jest.Mock).mockResolvedValue({ ...mockArch, name: 'Updated' });

      const response = await request(app)
        .put('/architectures/101')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Updated' });
      
      expect(response.status).toBe(200);
      expect(response.body.name).toBe('Updated');
    });

    it('should deny a non-owner from updating a private architecture', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);

      const response = await request(app)
        .put('/architectures/101')
        .set('Authorization', 'Bearer valid-token-2')
        .send({ name: 'Hacked' });
      
      expect(response.status).toBe(403);
    });

    it('should deny a non-owner from updating even a public architecture', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(publicArch);

      const response = await request(app)
        .put('/architectures/102')
        .set('Authorization', 'Bearer valid-token-2')
        .send({ name: 'Hacked' });
      
      expect(response.status).toBe(403);
    });

    it('should return 500 if update fails', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);
      (db.orm.public.Architecture.update as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await request(app)
        .put('/architectures/101')
        .set('Authorization', 'Bearer valid-token')
        .send({ name: 'Updated' });
      
      expect(response.status).toBe(500);
    });
  });

  describe('Delete Architecture', () => {
    it('should allow the owner to delete their architecture', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);
      (db.orm.public.Architecture.delete as jest.Mock).mockResolvedValue(mockArch);

      const response = await request(app)
        .delete('/architectures/101')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(204);
    });

    it('should deny a non-owner from deleting an architecture', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);

      const response = await request(app)
        .delete('/architectures/101')
        .set('Authorization', 'Bearer valid-token-2');
      
      expect(response.status).toBe(403);
    });

    it('should return 500 if delete fails', async () => {
      (db.orm.public.Architecture.first as jest.Mock).mockResolvedValue(mockArch);
      (db.orm.public.Architecture.delete as jest.Mock).mockRejectedValue(new Error('DB Error'));

      const response = await request(app)
        .delete('/architectures/101')
        .set('Authorization', 'Bearer valid-token');
      
      expect(response.status).toBe(500);
    });
  });
});
