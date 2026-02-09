import Link from "next/link";
import { FormControl, FormSelect } from "react-bootstrap";
export default function Profile() {
  return (
    <div id="wd-profile-screen">
      <h1>Profile</h1>
      <FormControl defaultValue="ednguon2005"
        placeholder="username" id="wd-username" className="mb-2" />
      <FormControl defaultValue="123"
        placeholder="password" type="password" id="wd-password" className="mb-2" />
      <FormControl defaultValue="Edward"
        placeholder="First Name" id="wd-firstname" className="mb-2" />
      <FormControl defaultValue="Nguon"
        placeholder="Last Name" id="wd-lastname" className="mb-2" />
      <FormControl type="date" id="wd-dob" className="mb-2" />
      <FormControl defaultValue="nguon.e@northeastern.edu"
        placeholder="Email" id="wd-email" className="mb-2" />
      <FormSelect id="wd-role" className="mb-2">
        <option>User</option>
        <option>Admin</option>
        <option>Faculty</option>
        <option>Student</option>
      </FormSelect>
      <Link href="/account/signin" className="btn btn-warning w-100">Signout</Link>
    </div>
  );
}
