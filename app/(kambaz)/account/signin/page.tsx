"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as client from "../client";

export default function Signin() {
  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const signin = async () => {
    setError("");
    try {
      const user = await client.signin(credentials);
      if (!user) return;
      dispatch(setCurrentUser(user));
      router.push("/dashboard");
    } catch (e: any) {
      setError(e.response?.data?.message || "Unable to login. Try again.");
    }
  };
  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      {error && <div className="alert alert-danger mb-2">{error}</div>}
      <input className="form-control mb-2" placeholder="username" id="wd-username"
        value={credentials.username}
        onChange={(e) => {
          setError("");
          setCredentials({ ...credentials, username: e.target.value });
        }} />
      <input className="form-control mb-2" placeholder="password" type="password" id="wd-password"
        value={credentials.password}
        onChange={(e) => {
          setError("");
          setCredentials({ ...credentials, password: e.target.value });
        }} />
      <button onClick={signin} id="wd-signin-btn" className="btn btn-primary w-100 mb-2">
        Sign in </button>
      <Link id="wd-signup-link" href="/account/signup">Sign up</Link>
    </div>
  );
}
