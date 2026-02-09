import Link from "next/link";
import { FormControl } from "react-bootstrap";
export default function Signin() {
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <FormControl id="wd-username"
        placeholder="username" defaultValue="ednguon2005"
        className="mb-2" />
      <FormControl id="wd-password"
        placeholder="password" type="password" defaultValue="123"
        className="mb-2" />
      <Link id="wd-signin-btn"
        href="/account/profile"
        className="btn btn-primary w-100 mb-2">
        Sign in </Link>
      <Link id="wd-signup-link" href="/account/signup">Sign up</Link>
    </div>
  );
}
