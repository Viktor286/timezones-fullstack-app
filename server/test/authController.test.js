import { postSignupRequest, postSigninRequest, deleteUserOpenAccessRequest } from './requests.js';
import dotenv from 'dotenv';
dotenv.config({ path: './env/dev.env' });

const testUser = {
  email: 'test-user@mail.com',
  password: '12312123123',
};

const tempTestUser = {
  email: 'temp-test-user@mail.com',
  password: '12312123123',
};

const nonExistUser = {
  email: 'non-exist-user@mail.com',
  password: '12312123123',
};

describe('Signup', function () {
  it('should give a 500 if pass confirmation is wrong', async function () {
    const [response, result] = await postSignupRequest({
      email: nonExistUser.email,
      password: nonExistUser.password,
    });
    expect(response.status).toEqual(500);
    expect(result.status).toEqual('error');
    expect(result.message).toEqual("Password doesn't look correct");
  });

  it('should give a 500 from mongoose if not all required fields', async function () {
    let [response, result] = await postSignupRequest({
      email: nonExistUser.email,
    });
    expect(response.status).toEqual(500);
    expect(result.status).toEqual('error');
    expect(result.message).toEqual("Password doesn't look correct");

    [response, result] = await postSignupRequest({
      password: nonExistUser.password,
      passwordConfirm: nonExistUser.password,
    });
    expect(response.status).toEqual(500);
    expect(result.status).toEqual('error');
    expect(result.error.errors.email.name).toEqual('ValidatorError');
  });

  it('should success register new user and set token & access_token cookie', async function () {
    const deleteRes = await deleteUserOpenAccessRequest('temp-test-user@mail.com');
    expect(deleteRes.status === 404 || deleteRes.status === 204).toBeTruthy();

    const [response, result] = await postSignupRequest({
      email: tempTestUser.email,
      password: tempTestUser.password,
      passwordConfirm: tempTestUser.password,
    });

    expect(response.status).toEqual(201);

    const { email, role, password } = result.data.user;
    expect(email).toBe(tempTestUser.email);
    expect(role).toBe('user');
    expect(password).toBeFalsy();

    expect(result.token.length).toBeGreaterThan(50);
    const cookie = response.headers.get('set-cookie');
    expect(cookie.startsWith(`access_token=${result.token}`)).toBeTruthy();

    // const cleanupResult = await deleteUserOpenAccessRequest('temp-test-user@mail.com');
    // expect(cleanupResult.status === 404 || cleanupResult.status === 204).toBeTruthy();
  });
});

describe('Sign in', function () {
  beforeAll(async () => {
    const [response, result] = await postSignupRequest({
      email: testUser.email,
      password: testUser.password,
      passwordConfirm: testUser.password,
    });

    expect(response.status).toEqual(201);

    const { email, role, password } = result.data.user;
    expect(email).toBe(testUser.email);
    expect(role).toBe('user');
    expect(password).toBeFalsy();

    expect(result.token.length).toBeGreaterThan(50);
    const cookie = response.headers.get('set-cookie');
    expect(cookie.startsWith(`access_token=${result.token}`)).toBeTruthy();
  });

  it('should perform successful signin', async function () {
    const [response, result] = await postSigninRequest({
      email: testUser.email,
      password: testUser.password,
    });

    expect(response.status).toEqual(200);
    expect(result.status).toEqual('success');

    const { email, role, password } = result.data.user;
    expect(email).toBe(testUser.email);
    expect(role).toBe('user');
    expect(password).toBeFalsy();

    expect(result.token.length).toBeGreaterThan(50);
    const cookie = response.headers.get('set-cookie');
    expect(cookie.startsWith(`access_token=${result.token}`)).toBeTruthy();
  });

  it('should reject signin if password wrong', async function () {
    const [response, result] = await postSigninRequest({
      email: testUser.email,
      password: 'some-wrong-pass',
    });

    expect(response.status).toEqual(401);
    expect(result.status).toEqual('fail');
    expect(result.message).toEqual('Incorrect email or password');
  });
});
