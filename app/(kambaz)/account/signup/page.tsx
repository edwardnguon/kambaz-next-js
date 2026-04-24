"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { setCurrentUser } from "../reducer";
import { useDispatch } from "react-redux";
import { useState } from "react";
import { FormControl, FormSelect, Button } from "react-bootstrap";
import * as client from "../client";

export default function Signup() {
  const [user, setUser] = useState({
    username: "",
    password: "",
    role: "STUDENT",
  });
  const [error, setError] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();
  const signup = async () => {
    setError("");
    try {
      const currentUser = await client.signup(user);
      dispatch(setCurrentUser(currentUser));
      router.push("/account/profile");
    } catch (e: any) {
      setError(e.response?.data?.message || "Unable to create account.");
    }
  };
  return (
    <div className="wd-signup-screen">
      <h1>Sign up</h1>
      {error && <div className="alert alert-danger mb-2">{error}</div>}
      <FormControl value={user.username} onChange={(e) => {
        setError("");
        setUser({ ...user, username: e.target.value });
      }}
        className="wd-username b-2" placeholder="username" />
      <FormControl value={user.password} onChange={(e) => {
        setError("");
        setUser({ ...user, password: e.target.value });
      }}
        className="wd-password mb-2" placeholder="password" type="password"/>
      <FormSelect
        value={user.role}
        onChange={(e) => {
          setError("");
          setUser({ ...user, role: e.target.value });
        }}
        className="mb-2"
      >
        <option value="STUDENT">Student</option>
        <option value="FACULTY">Faculty</option>
      </FormSelect>
      <Button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </Button><br />
      <Link href="/account/signin" className="wd-signin-link">Sign in</Link>
    </div>
  );
}
