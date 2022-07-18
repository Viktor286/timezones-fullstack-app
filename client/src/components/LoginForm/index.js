import { setLocalUserAuth } from '../../model/localStore';
import { signInUser } from '../../requests/user';

export default function LoginForm({ auth, setAuth }) {
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

  if (auth.token?.length > 30) {
    return <section className="logged-in-user">({auth.email})</section>;
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
