import { jest } from '@jest/globals';
import request from 'supertest';

// Mock the database
jest.unstable_mockModule('../prisma/db.js', () => ({
  db: {
    orm: {
      public: {
        User: {
          all: jest.fn(),
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

describe('Authentication Middleware', () => {
  it('should return 401 if no authorization header is provided', async () => {
    const response = await request(app).get('/users');
    expect(response.status).toBe(401);
  });

  it('should return 401 if invalid token is provided', async () => {
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer invalid-token');
    expect(response.status).toBe(401);
  });

  it('should return 200 if valid token is provided', async () => {
    // We will need to mock the token validation logic
    const response = await request(app)
      .get('/users')
      .set('Authorization', 'Bearer valid-token');
    expect(response.status).toBe(200);
  });
});
