import { setLocalUserAuth, setLocalUserSettings } from '../../model/localStore';
import { signInUser, logOutUser } from '../../requests/user';
import { createClockItem } from '../../model/clockItem';
import { useState } from 'react';

const defaultClocksList = [createClockItem()];

export default function LoginForm({ auth, setAuth, setClockListList }) {
  const [loginLayout, setLoginLayout] = useState(auth.token?.length > 30 ? 'logged-in' : 'login');

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const { token } = await signInUser(email, password);
    setLocalUserAuth({ token, email });
    setAuth({ token, email });
    setLoginLayout('logged-in');
  };

  const onPickLogin = () => {
    setLoginLayout('login');
  };

  const onPickSignup = () => {
    setLoginLayout('signup');
  };

  const logOut = async (e) => {
    e.preventDefault();
    const { email, token } = auth;

    if (email && token) {
      await logOutUser(auth);
      setLocalUserAuth('');
      setLocalUserSettings('');
      // todo: instead of reset we could keep separate localstorage for non-logged users
      setClockListList(defaultClocksList);
      setAuth({});
      setLoginLayout('login');
    }
  };

  if (loginLayout === 'logged-in') {
    return (
      <section className="login-form">
        ({auth.email}) <button onClick={logOut}>log out</button>
      </section>
    );
  }

  if (loginLayout === 'login') {
    return (
      <section className="login-form">
        <form onSubmit={onSubmitHandler}>
          <div>
            <label htmlFor="username">Email:</label>
            <input name="email" type="email" id="email" size="30" required />
          </div>

          <div>
            <label htmlFor="pass">Password (8 characters minimum):</label>
            <input type="password" name="password" minLength="8" required />
          </div>

          <input type="submit" value="Sign in" />
          <button onClick={onPickSignup}>or sign up</button>
        </form>
      </section>
    );
  }

  if (loginLayout === 'signup') {
    return (
      <section className="login-form">
        SIGNUP COMPONENT<button onClick={onPickLogin}>back to login</button>
      </section>
    );
  }
}
