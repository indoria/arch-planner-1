import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database
jest.unstable_mockModule('../prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        User: {
          all: jest.fn()
            .mockResolvedValueOnce([{ id: 1, email: 'test@example.com' }])
            .mockRejectedValueOnce(new Error('DB Error')),
          create: jest.fn(),
          where: jest.fn().mockReturnThis(),
          first: jest.fn(),
        }
      }
    }
  }
}));

// Dynamically import app
const { default: app } = await import('./app.js');

describe('GET /health', () => {
  it('should return 200 OK and status up', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'up' });
  });
});

describe('GET /users', () => {
  it('should return 200 and a list of users when authenticated', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer valid-token');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
    expect(response.body[0].email).toBe('test@example.com');
  });

  it('should return 401 if not authenticated', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(401);
  });

  it('should return 500 if database fails and authenticated', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer valid-token');
    expect(response.status).toBe(500);
    expect(response.body).toEqual({ error: 'Failed to fetch users' });
  });
});
