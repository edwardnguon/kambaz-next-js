import Link from "next/link";
import { ListGroup, ListGroupItem } from "react-bootstrap";

export default function Labs() {
  return (
    <div id="wd-labs">
      <h1>Labs</h1>
      <h2>Edward Nguon - Section 02</h2>
      <ListGroup>
        <ListGroupItem>
          <Link href="/labs/lab1" id="wd-lab1-link">
            Lab 1: HTML Examples </Link>
        </ListGroupItem>
        <ListGroupItem>
          <Link href="/labs/lab2" id="wd-lab2-link">
            Lab 2: CSS Basics </Link>
        </ListGroupItem>
        <ListGroupItem>
          <Link href="/labs/lab3" id="wd-lab3-link">
            Lab 3: JavaScript Fundamentals </Link>
        </ListGroupItem>
        <ListGroupItem>
          <Link href="/" id="wd-kambaz-link">
            Kambaz </Link>
        </ListGroupItem>
        <ListGroupItem>
          <a href="https://github.com/edwardnguon/kambaz-next-js" id="wd-github-link">
            GitHub Repository </a>
        </ListGroupItem>
      </ListGroup>
    </div>
  );
}
