// todo: reset auth if breaking code received
export async function getUserTimezones(auth) {
  const { email, token } = auth;

  if (email && token?.length > 30) {
    const userDataRes = await fetch(`http://localhost:8080/api/v1/users/${email}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const userData = await userDataRes.json();
    const {
      data: {
        user: { timezones: timezonesString },
      },
    } = userData;

    const timezones = JSON.parse(timezonesString);

    return Array.isArray(timezones) && timezones;
  }
}

export async function setUserTimezones(newClockList, auth) {
  const { email, token } = auth;

  if (email && token?.length > 30) {
    const payload = JSON.stringify({
      timezones: JSON.stringify(newClockList),
    });

    const userDataRes = await fetch(`http://localhost:8080/api/v1/users/${email}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: payload,
    });
    return true;
  }

  return false;
}

export async function signInUser(email, password) {
  const response = await fetch('http://localhost:8080/api/v1/users/signin', {
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
}
