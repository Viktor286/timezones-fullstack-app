import fetch from 'node-fetch';

// todo: try to spin mongo in memory
// https://github.com/nodkz/mongodb-memory-server

describe('GET /api/v1/users', function () {
  it('responds with json', async function () {
    const response = await fetch('http://localhost:3000/api/v1/users', {
      method: 'GET',
      headers: {
        accept: 'application/json',
      },
    });

    const result = await response.json();

    expect(response.headers.get('content-type')).toMatch(/json/);
    expect(response.status).toEqual(200);
    expect(result.status).toEqual('success');
    expect(result.data).toBeTruthy();
  });
});
