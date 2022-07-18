import fetch from 'node-fetch';
import dotenv from 'dotenv';
dotenv.config({ path: './env/dev.env' });

async function postSignupRequest(body) {
  const response = await fetch('http://localhost:3000/api/v1/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return [response, result];
}

async function deleteUserRequest(userEmail) {
  const response = await fetch(`http://localhost:3000/api/v1/users/${userEmail}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Test-Open-Access': process.env.TEST_OPEN_ACCESS,
    },
  });
  return response;
}

describe('Signup', function () {
  it('should give a 500 if pass confirmation is wrong', async function () {
    const [response, result] = await postSignupRequest({
      email: 'freds@mail.com',
      password: '12312123123',
    });
    expect(response.status).toEqual(500);
    expect(result.status).toEqual('error');
    expect(result.message).toEqual("Password doesn't look correct");
  });

  it('should give a 500 from mongoose if not all required fields', async function () {
    let [response, result] = await postSignupRequest({
      email: 'freds@mail.com',
    });
    expect(response.status).toEqual(500);
    expect(result.status).toEqual('error');
    expect(result.message).toEqual("Password doesn't look correct");

    [response, result] = await postSignupRequest({
      password: '123123123123',
      passwordConfirm: '123123123123',
    });
    expect(response.status).toEqual(500);
    expect(result.status).toEqual('error');
    expect(result.error.errors.email.name).toEqual('ValidatorError');
  });

  it('should success register new user and set token & access_token cookie', async function () {
    await deleteUserRequest('test-user@mail.com');

    const [response, result] = await postSignupRequest({
      email: 'test-user@mail.com',
      password: '12312123123',
      passwordConfirm: '12312123123',
    });

    expect(response.status).toEqual(201);

    const { email, role, password } = result.data.user;
    expect(email).toBe('test-user@mail.com');
    expect(role).toBe('user');
    expect(password).toBeFalsy();

    expect(result.token.length).toBeGreaterThan(50);
    const cookie = response.headers.get('set-cookie');
    expect(cookie.startsWith(`access_token=${result.token}`)).toBeTruthy();

    await deleteUserRequest('test-user@mail.com');
  });
});
