"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as db from "../../database";

export default function Signin() {
  const [credentials, setCredentials] = useState<any>({ username: "ednguon2005", password: "123" });
  const dispatch = useDispatch();
  const router = useRouter();
  const signin = () => {
    const user = db.users.find(
      (u: any) =>
        u.username === credentials.username &&
        u.password === credentials.password
    );
    if (!user) return;
    dispatch(setCurrentUser(user));
    router.push("/dashboard");
  };
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <input className="form-control mb-2" placeholder="username" id="wd-username"
        value={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })} />
      <input className="form-control mb-2" placeholder="password" type="password" id="wd-password"
        value={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })} />
      <button onClick={signin} id="wd-signin-btn" className="btn btn-primary w-100 mb-2">
        Sign in </button>
      <Link id="wd-signup-link" href="/account/signup">Sign up</Link>
    </div>
  );
}
