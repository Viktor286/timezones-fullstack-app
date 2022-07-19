import { setLocalUserAuth, setLocalUserSettings } from '../../model/localStore';
import { signInUser, logOutUser, signUpUser } from '../../requests/user';
import { createClockItem } from '../../model/clockItem';
import { useState } from 'react';

const defaultClocksList = [createClockItem()];

function LoginFormWrapper({ children }) {
  return <section className="login-form">{children}</section>;
}

export default function LoginForm({ auth, setAuth, setClockListList }) {
  const [loginLayout, setLoginLayout] = useState(auth.token?.length > 30 ? 'logged-in' : 'login');
  const [loginStatus, setLoginStatus] = useState('');

  const onLoginSubmitHandler = async (e) => {
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

  const onSingupSubmitHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const passwordConfirm = formData.get('confirm-password');

    if (password === passwordConfirm) {
      const { token } = await signUpUser(email, password, passwordConfirm);
      setLocalUserAuth({ token, email });
      setAuth({ token, email });
      setLoginLayout('logged-in');
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
    }
  };

  if (loginLayout === 'logged-in') {
    return (
      <LoginFormWrapper>
        ({auth.email}) <button onClick={logOut}>log out</button>
      </LoginFormWrapper>
    );
  }

  if (loginLayout === 'login') {
    return (
      <LoginFormWrapper>
        <form onSubmit={onLoginSubmitHandler}>
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
      </LoginFormWrapper>
    );
  }

  if (loginLayout === 'signup') {
    return (
      <LoginFormWrapper>
        <form onSubmit={onSingupSubmitHandler}>
          <div>
            <label htmlFor="username">Email:</label>
            <input name="email" type="email" id="email" size="30" required />
          </div>
          <div>
            <label htmlFor="pass">Password (8 characters minimum):</label>
            <input type="password" name="password" minLength="8" required />
          </div>
          <div>
            <label htmlFor="pass">Confirm Password:</label>
            <input type="password" name="confirm-password" minLength="8" required />
          </div>
          <input type="submit" value="Sign up" />
          <button onClick={onPickLogin}>or log in</button>
          <div>{loginStatus}</div>
        </form>
      </LoginFormWrapper>
    );
  }
}
