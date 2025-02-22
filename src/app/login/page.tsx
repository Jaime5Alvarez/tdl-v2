import { login, signup } from "src/app/login/actions";
import GoogleOneTap from "src/app/components/auth/google-one-tap";
import MicrosoftOneTap from "src/app/components/auth/microsoft-one-tap";
export default async function LoginPage() {


  return (
    <>
    <form>
      <label htmlFor="email">Email:</label>
      <input id="email" name="email" type="email" required />
      <label htmlFor="password">Password:</label>
      <input id="password" name="password" type="password" required />
      <button formAction={login}>Log in</button>
      <button formAction={signup}>Sign up</button>
      <GoogleOneTap />
      <MicrosoftOneTap />

    </form>
    </>
  )
}
