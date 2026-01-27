import Link from "next/link";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h2>Edward Nguon - Section 02</h2>
      <ul>
        <li>
          <Link href="/labs/lab1" id="wd-lab1-link">
            Lab 1: HTML Examples </Link>
        </li>
        <li>
          <Link href="/labs/lab2" id="wd-lab2-link">
            Lab 2: CSS Basics </Link>
        </li>
        <li>
          <Link href="/labs/lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals </Link>
        </li>
        <li>
          <Link href="/" id="wd-kambaz-link">
            Kambaz </Link>
        </li>
        <li>
          <a href="https://github.com/edwardnguon/kambaz-next-js" id="wd-github-link">
            GitHub Repository </a>
        </li>
      </ul>
    </div>
);}
