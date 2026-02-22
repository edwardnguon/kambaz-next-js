"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function CourseNavigation({ cid }: { cid: string }) {
  const pathname = usePathname();
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {links.map((link) => {
        const path = link === "People"
          ? `/courses/${cid}/people/table`
          : `/courses/${cid}/${link.toLowerCase()}`;
        const isActive = pathname.includes(`/${link.toLowerCase()}`);
        return (
          <Link key={link} href={path}
            className={`list-group-item border-0 ${isActive ? "active" : "text-danger"}`}>
            {link}
          </Link>
        );
      })}
    </div>
  );
}
