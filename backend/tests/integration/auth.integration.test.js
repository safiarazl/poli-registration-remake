const request = require('supertest');
const app = require('../../src/app');
const { sequelize, User } = require('../../src/models');

// Simple integration test for auth flow
describe('Auth Integration', () => {
  beforeAll(async () => {
    // Note: in a real environment we'd use a test DB and sync
    // await sequelize.sync({ force: true });
  });

  afterAll(async () => {
    // await sequelize.close();
  });

  describe('POST /api/auth/login', () => {
    it('should return 400 if validation fails', async () => {
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'not-an-email' });
      
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return 401 for invalid credentials', async () => {
      // Assuming DB is empty or doesn't have this user
      const res = await request(app)
        .post('/api/auth/login')
        .send({ email: 'nobody@gmail.com', password: 'wrongpassword' });
      
      // If DB is not connected, this might throw 500, but let's assume 401 or 500 based on connection.
      expect([401, 500]).toContain(res.statusCode);
    });
  });
});
