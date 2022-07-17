import request from 'supertest';
import createExpressApp from './app.js';

const app = createExpressApp();

describe('GET /users', function () {
  it('responds with json', async function () {
    const response = await request(app).get('/');
    expect(response.headers['content-type']).toMatch(/json/);
    expect(response.status).toEqual(200);
  });
});
