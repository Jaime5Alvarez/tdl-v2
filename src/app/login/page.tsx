import { login, signup } from "@/app/login/actions";
import GoogleOneTap from "@/app/components/auth/google-one-tap";
import MicrosoftOneTap from "@/app/components/auth/microsoft-one-tap";
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
