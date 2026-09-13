import request from 'supertest';
import app from './app';

describe('GET /health', () => {
  it('should return 200 OK and status up', async () => {
    const response = await request(app).get('/health');
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'up' });
  });
});
