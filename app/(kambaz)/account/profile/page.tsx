"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentUser } from "../reducer";
import { RootState } from "../../store";
import { FormControl, FormSelect } from "react-bootstrap";
import * as client from "../client";

type ProfileState = {
  _id: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
  dob: string;
  email: string;
  role: string;
};

const emptyProfile: ProfileState = {
  _id: "",
  username: "",
  password: "",
  firstName: "",
  lastName: "",
  dob: "",
  email: "",
  role: "USER",
};

const normalizeProfile = (user: Partial<ProfileState> | null | undefined): ProfileState => ({
  ...emptyProfile,
  ...user,
});

export default function Profile() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [profile, setProfile] = useState<ProfileState>(() => normalizeProfile(currentUser));
  const dispatch = useDispatch();
  const router = useRouter();
  const updateProfile = async () => {
    const updatedProfile = await client.updateUser(profile);
    dispatch(setCurrentUser(updatedProfile));
    setProfile(normalizeProfile(updatedProfile));
  };
  const signout = async () => {
    await client.signout();
    dispatch(setCurrentUser(null));
    router.push("/account/signin");
  };
  useEffect(() => {
    if (!currentUser) {
      router.replace("/account/signin");
    }
  }, [currentUser, router]);
  if (!currentUser) {
    return null;
  }
  return (
    <div id="wd-profile-screen">
      <h3>Profile</h3>
      <div>
        <FormControl id="wd-username" className="mb-2"
          value={profile.username ?? ""}
          onChange={(e) => setProfile({ ...profile, username: e.target.value })} />
        <FormControl id="wd-password" className="mb-2"
          value={profile.password ?? ""}
          onChange={(e) => setProfile({ ...profile, password: e.target.value })} />
        <FormControl id="wd-firstname" className="mb-2"
          value={profile.firstName ?? ""}
          onChange={(e) => setProfile({ ...profile, firstName: e.target.value })} />
        <FormControl id="wd-lastname" className="mb-2"
          value={profile.lastName ?? ""}
          onChange={(e) => setProfile({ ...profile, lastName: e.target.value })} />
        <FormControl id="wd-dob" className="mb-2" type="date"
          value={profile.dob ?? ""}
          onChange={(e) => setProfile({ ...profile, dob: e.target.value })} />
        <FormControl id="wd-email" className="mb-2"
          value={profile.email ?? ""}
          onChange={(e) => setProfile({ ...profile, email: e.target.value })} />
        <FormSelect className="form-control mb-2" id="wd-role"
          value={profile.role ?? "USER"}
          onChange={(e) => setProfile({ ...profile, role: e.target.value })}>
          <option value="USER">User</option>
          <option value="ADMIN">Admin</option>
          <option value="FACULTY">Faculty</option>
          <option value="STUDENT">Student</option>
        </FormSelect>
        <div>
          <button onClick={updateProfile} className="btn btn-primary w-100 mb-2"> Update </button>
          <button onClick={signout} className="wd-signout-btn btn btn-danger w-100">
            Sign out
          </button>
        </div>
      </div>
    </div>
  );
}
