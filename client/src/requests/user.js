// todo: reset auth if breaking code received
const baseDomain = 'http://localhost:8080';

export async function getUserTimezones(auth) {
  const { email, token } = auth;

  if (email && token?.length > 30) {
    try {
      const userDataRes = await fetch(`${baseDomain}/api/v1/users/${email}`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // if (userDataRes.status === 401) {
      //   throw new Error('Unauthorized');
      // }

      const userData = await userDataRes.json();
      const {
        data: {
          user: { timezones: timezonesString },
        },
      } = userData;

      const timezones = JSON.parse(timezonesString);

      return Array.isArray(timezones) && timezones;
    } catch (e) {
      console.error(e);
    }
  }
}

export async function setUserTimezones(newClockList, auth) {
  const { email, token } = auth;

  if (email && token?.length > 30) {
    try {
      const payload = JSON.stringify({
        timezones: JSON.stringify(newClockList),
      });

      const userDataRes = await fetch(`${baseDomain}/api/v1/users/${email}`, {
        method: 'PATCH',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: payload,
      });
      return userDataRes;
    } catch (e) {
      console.error(e);
    }
  }

  return false;
}

export async function signInUser(email, password) {
  try {
    const response = await fetch(`${baseDomain}/api/v1/users/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function signUpUser(email, password, passwordConfirm) {
  try {
    const response = await fetch(`${baseDomain}/api/v1/users/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
        passwordConfirm,
      }),
    });
    return await response.json();
  } catch (e) {
    console.error(e);
  }
}

export async function logOutUser(auth) {
  const { token } = auth;

  if (token) {
    try {
      const response = await fetch(`${baseDomain}/api/v1/users/logout`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      return await response.json();
    } catch (e) {
      console.error(e);
    }
  }
}
