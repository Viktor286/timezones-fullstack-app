import fetch from 'node-fetch';
import dotenv from 'dotenv';
import {
  postSigninRequest,
  createTestUserRecord,
  createTestAdminRecord,
  createTestManagerRecord,
  deleteUserOpenAccessRequest,
} from './requests';
dotenv.config({ path: './env/dev.env' });

describe('getAllUsers', function () {
  beforeAll(async () => {
    const [adminRes] = await createTestAdminRecord();
    const [userRes] = await createTestUserRecord();
    const [managerRes] = await createTestManagerRecord();

    if (adminRes.status !== 201 && managerRes.status === 201 && userRes.status !== 201) {
      throw new Error("buildup users didn't perform well");
    }
  });

  it('should provide getAllUsers for admins including users and manager', async function () {
    const [response, result] = await postSigninRequest({
      email: 'admin@mail.com',
      password: 'superAdminPass',
    });

    const { token, status, data } = result;

    expect(status).toEqual('success');
    expect(response.status).toEqual(200);

    const { email, role } = data.user;
    expect(email).toBe('admin@mail.com');
    expect(role).toBe('admin');

    const getAllUsersRes = await fetch('http://localhost:3000/api/v1/users/', {
      method: 'GET',
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    expect(getAllUsersRes.status).toEqual(200);
    const getAllUsersResult = await getAllUsersRes.json();
    expect(getAllUsersResult.status).toEqual('success');

    expect(getAllUsersResult.data.users.find((e) => e.role === 'user')).toBeTruthy();
    expect(getAllUsersResult.data.users.find((e) => e.role === 'manager')).toBeTruthy();
  });

  it('should provide getAllUsers for managers including only users', async function () {
    const [response, result] = await postSigninRequest({
      email: 'manager@mail.com',
      password: 'managerPass',
    });

    const { token, status, data } = result;

    expect(status).toEqual('success');
    expect(response.status).toEqual(200);

    const { email, role } = data.user;
    expect(email).toBe('manager@mail.com');
    expect(role).toBe('manager');

    const getAllUsersRes = await fetch('http://localhost:3000/api/v1/users/', {
      method: 'GET',
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    expect(getAllUsersRes.status).toEqual(200);
    const getAllUsersResult = await getAllUsersRes.json();
    expect(getAllUsersResult.status).toEqual('success');

    expect(getAllUsersResult.data.users.find((e) => e.role === 'user')).toBeTruthy();
    expect(getAllUsersResult.data.users.find((e) => e.role === 'manager')).toBeFalsy();
    expect(getAllUsersResult.data.users.find((e) => e.role === 'admin')).toBeFalsy();
  });

  it('should not provide getAllUsers for users', async function () {
    const [response, result] = await postSigninRequest({
      email: 'user@mail.com',
      password: 'regularUserPass',
    });

    const { token, status, data } = result;

    expect(status).toEqual('success');
    expect(response.status).toEqual(200);

    const { email, role } = data.user;
    expect(email).toBe('user@mail.com');
    expect(role).toBe('user');

    const getAllUsersRes = await fetch('http://localhost:3000/api/v1/users/', {
      method: 'GET',
      credentials: 'include',
      mode: 'no-cors',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    expect(getAllUsersRes.status).toEqual(403);
    const getAllUsersResult = await getAllUsersRes.json();
    expect(getAllUsersResult.message).toEqual('Permission denied for this role');
  });

  afterAll(async () => {
    const [adminRes] = await deleteUserOpenAccessRequest('admin@mail.com');
    const [managerRes] = await deleteUserOpenAccessRequest('manager@mail.com');
    const [userRes] = await deleteUserOpenAccessRequest('user@mail.com');

    if (adminRes.status !== 204 && managerRes.status === 204 && userRes.status !== 204) {
      throw new Error("cleanup users didn't perform well");
    }
  });
});
