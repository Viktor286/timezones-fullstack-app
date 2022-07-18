import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './env/dev.env' });

// todo: try to spin mongo in memory
// https://github.com/nodkz/mongodb-memory-server

describe('Root API /api/v1/', function () {
  it('should give 404', async function () {
    const response = await fetch('http://localhost:8080/api/v1/', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    const result = await response.json();
    const code = result.error.statusCode;
    expect(code).toEqual(404);
  });
});
