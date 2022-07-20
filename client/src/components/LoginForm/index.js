import { setLocalUserAuth, setLocalUserSettings } from '../../model/localStore';
import { signInUser, logOutUser, signUpUser } from '../../requests/user';
import { createClockItem } from '../../model/clockItem';
import { useState } from 'react';
import './index.css';

const defaultClocksList = [createClockItem()];

function LoginFormWrapper({ loginStatus, children, auth }) {
  return (
    <>
      <section className={`login-form ${auth.email ? 'logged-in' : null}`}>{children}</section>
      {loginStatus ? <div className="login-status">{loginStatus}</div> : null}
    </>
  );
}

export default function LoginForm({ auth, setAuth, setClockListList }) {
  const [loginLayout, setLoginLayout] = useState(auth.token?.length > 30 ? 'logged-in' : 'login');
  const [loginStatus, setLoginStatus] = useState('');

  const onLoginSubmitHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formEmail = formData.get('email');
    const formPassword = formData.get('password');
    const { token, data } = await signInUser(formEmail, formPassword);
    const { user: { email, role } = {} } = data || {};
    if (token) {
      setLocalUserAuth({ token, email, role });
      setAuth({ token, email, role });
      setLoginLayout('logged-in');
      setLoginStatus('');
    } else {
      setLoginStatus('Looks like there is no such user');
    }
  };

  const onSingupSubmitHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const formEmail = formData.get('email');
    const formPassword = formData.get('password');
    const formPasswordConfirm = formData.get('confirm-password');

    if (formPassword === formPasswordConfirm) {
      const { token, data } = await signUpUser(formEmail, formPassword, formPasswordConfirm);
      const { user: { email, role } = {} } = data || {};
      setLocalUserAuth({ token, email, role });
      setAuth({ token, email, role });
      setLoginLayout('logged-in');
      setLoginStatus('');
    } else {
      setLoginStatus('Please insert correct confirmation');
    }
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
      //  but not in the requirements now
      setClockListList(defaultClocksList);
      setAuth({});
      setLoginLayout('login');
      setLoginStatus('');
    }
  };

  if (loginLayout === 'logged-in') {
    return (
      <LoginFormWrapper loginStatus={loginStatus} auth={auth}>
        <div className="logged-in-indicator">
          {auth.email}
          <button onClick={logOut} className="bt-logout">
            (log out)
          </button>
        </div>
      </LoginFormWrapper>
    );
  }

  if (loginLayout === 'login') {
    return (
      <LoginFormWrapper loginStatus={loginStatus} auth={auth}>
        <form onSubmit={onLoginSubmitHandler}>
          <div>
            <label htmlFor="username">Email:</label>
            <input name="email" type="email" id="email" size="30" required />
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input type="password" name="password" minLength="8" required />
          </div>
          <div>
            <div className="login-button-margin">&nbsp;</div>
            <input className="bt-login" type="submit" value="Login" />
            <button onClick={onPickSignup} className="bt-or-singup">
              (or sign up)
            </button>
          </div>
        </form>
      </LoginFormWrapper>
    );
  }

  if (loginLayout === 'signup') {
    return (
      <LoginFormWrapper loginStatus={loginStatus} auth={auth}>
        <form onSubmit={onSingupSubmitHandler}>
          <div>
            <label htmlFor="username">Email:</label>
            <input name="email" type="email" id="email" size="30" required />
          </div>
          <div>
            <label htmlFor="pass">Password:</label>
            <input type="password" name="password" minLength="8" required />
          </div>
          <div>
            <label htmlFor="pass">Confirm:</label>
            <input type="password" name="confirm-password" minLength="8" required />
          </div>
          <div>
            <div className="login-button-margin">&nbsp;</div>
            <input className="bt-singup" type="submit" value="Sign up" />
            <button onClick={onPickLogin} className="bt-or-login">
              or log in
            </button>
          </div>
        </form>
      </LoginFormWrapper>
    );
  }
}
