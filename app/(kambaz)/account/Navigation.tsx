"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "../store";

export default function AccountNavigation() {
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const links = currentUser ? ["profile"] : ["signin", "signup"];
  const pathname = usePathname();
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => (
        <Link key={link} href={`/account/${link}`}
          className={`list-group-item text-danger border-0 ${pathname.endsWith(link) ? "active" : ""}`}>
          {link.charAt(0).toUpperCase() + link.slice(1)}
        </Link>
      ))}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link href="/account/users"
          className={`list-group-item text-danger border-0 ${pathname.includes("users") ? "active" : ""}`}>
          Users
        </Link>
      )}
    </div>
  );
}
