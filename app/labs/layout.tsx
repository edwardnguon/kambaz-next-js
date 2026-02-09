import { ReactNode } from "react";
import TOC from "./TOC";
import KambazNavigation from "../(kambaz)/Navigation";
import "../(kambaz)/styles.css";

export default function LabsLayout({
  children,
}: Readonly<{ children: ReactNode }>) {
  return (
    <div id="wd-kambaz">
      <KambazNavigation />
      <div className="wd-main-content-offset p-3">
        <TOC />
        <div className="mt-3">
          {children}
        </div>
      </div>
    </div>
  );
}