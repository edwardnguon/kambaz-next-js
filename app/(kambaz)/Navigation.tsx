"use client";
import { AiOutlineDashboard } from "react-icons/ai";
import { IoCalendarOutline } from "react-icons/io5";
import { LiaBookSolid, LiaCogSolid } from "react-icons/lia";
import { FaInbox, FaRegCircleUser } from "react-icons/fa6";
import { ListGroup, ListGroupItem } from "react-bootstrap";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function KambazNavigation() {
  const pathname = usePathname();
  const links = [
    { label: "Account",   href: "/account",   icon: FaRegCircleUser,   id: "wd-account-link" },
    { label: "Dashboard", href: "/dashboard",  icon: AiOutlineDashboard, id: "wd-dashboard-link" },
    { label: "Courses",   href: "/courses",    icon: LiaBookSolid,      id: "wd-course-link" },
    { label: "Calendar",  href: "/calendar",   icon: IoCalendarOutline,  id: "wd-calendar-link" },
    { label: "Inbox",     href: "/inbox",      icon: FaInbox,           id: "wd-inbox-link" },
    { label: "Labs",      href: "/labs",       icon: LiaCogSolid,       id: "wd-labs-link" },
  ];
  return (
    <ListGroup id="wd-kambaz-navigation" style={{ width: 120 }}
        className="rounded-0 position-fixed bottom-0 top-0 d-none d-md-block bg-black z-2">
      <ListGroupItem className="bg-black border-0 text-center" as="a"
          target="_blank" href="https://www.northeastern.edu/" id="wd-neu-link">
        <img src="/images/NEU.png" width="75px" alt="Northeastern University" />
      </ListGroupItem>
      {links.map((link) => {
        const active = pathname.startsWith(link.href);
        return (
          <ListGroupItem key={link.id}
            className={`border-0 text-center ${active ? "bg-white" : "bg-black"}`}>
            <Link href={link.label === "Courses" ? "/dashboard" : link.href}
              id={link.id}
              className={`text-decoration-none ${active ? "text-danger" : "text-white"}`}>
              <link.icon className={`fs-1 ${active ? "text-danger" : link.label === "Account" ? "text-white" : "text-danger"}`} />
              <br />
              {link.label}
            </Link>
          </ListGroupItem>
        );
      })}
    </ListGroup>
  );
}
