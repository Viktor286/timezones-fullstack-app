import { setLocalUserAuth, setLocalUserSettings } from '../../model/localStore';
import { signInUser, logOutUser } from '../../requests/user';
import { createClockItem } from '../../model/clockItem';

const defaultClocksList = [createClockItem()];

export default function LoginForm({ auth, setAuth, setClockListList }) {
  const onSubmitHandler = async (e) => {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = formData.get('email');
    const password = formData.get('password');
    const { token } = await signInUser(email, password);
    setLocalUserAuth({ token, email });
    setAuth({ token, email });
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
    }
  };

  if (auth.token?.length > 30) {
    return (
      <section className="logged-in-user">
        ({auth.email}) <button onClick={logOut}>log out</button>
      </section>
    );
  }

  return (
    <section className="login-user">
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
      </form>
    </section>
  );
}
