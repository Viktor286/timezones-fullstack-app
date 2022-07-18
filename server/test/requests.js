import fetch from 'node-fetch';

export async function createTestUserRecord() {
  const response = await fetch('http://localhost:8080/api/v1/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Test-Open-Access': process.env.TEST_OPEN_ACCESS,
    },
    body: JSON.stringify({
      email: 'user@mail.com',
      password: 'regularUserPass',
      passwordConfirm: 'regularUserPass',
    }),
  });
  const result = await response.json();
  return [response, result];
}

export async function createTestManagerRecord() {
  const response = await fetch('http://localhost:8080/api/v1/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Test-Open-Access': process.env.TEST_OPEN_ACCESS,
    },
    body: JSON.stringify({
      email: 'manager@mail.com',
      password: 'managerPass',
      passwordConfirm: 'managerPass',
      role: 'manager',
    }),
  });
  const result = await response.json();
  return [response, result];
}

export async function createTestAdminRecord() {
  const response = await fetch('http://localhost:8080/api/v1/users/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Test-Open-Access': process.env.TEST_OPEN_ACCESS,
    },
    body: JSON.stringify({
      email: 'admin@mail.com',
      password: 'superAdminPass',
      passwordConfirm: 'superAdminPass',
      role: 'admin',
    }),
  });
  const result = await response.json();
  return [response, result];
}

export async function deleteUserOpenAccessRequest(userEmail) {
  const response = await fetch(`http://localhost:8080/api/v1/users/${userEmail}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Test-Open-Access': process.env.TEST_OPEN_ACCESS,
    },
  });
  return response;
}

export async function postSignupRequest(body) {
  const response = await fetch('http://localhost:8080/api/v1/users/signup', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return [response, result];
}

export async function postSigninRequest(body) {
  const response = await fetch('http://localhost:8080/api/v1/users/signin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  const result = await response.json();
  return [response, result];
}

export async function deleteUserRequest(userEmail) {
  const response = await fetch(`http://localhost:8080/api/v1/users/${userEmail}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}
