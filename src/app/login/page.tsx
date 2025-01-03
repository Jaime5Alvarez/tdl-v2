import { login, signup } from "@/app/login/actions";
import GoogleOneTap from "@/app/components/google-one-tap";

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

    </form>
    </>
  )
}
