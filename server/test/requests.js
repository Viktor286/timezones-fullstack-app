import fetch from 'node-fetch';

export async function createTestUserRecord() {
  const [response, result] = await postSignupRequest({
    email: 'test-suit-user@mail.com',
    password: '12312123123',
    passwordConfirm: '12312123123',
  });

  return [response, result];
}

export async function deleteUserOpenAccessRequest(userEmail) {
  const response = await fetch(`http://localhost:3000/api/v1/users/${userEmail}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      'Test-Open-Access': process.env.TEST_OPEN_ACCESS,
    },
  });
  return response;
}

export async function postSignupRequest(body) {
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

export async function postSigninRequest(body) {
  const response = await fetch('http://localhost:3000/api/v1/users/signin', {
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
  const response = await fetch(`http://localhost:3000/api/v1/users/${userEmail}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  return response;
}
