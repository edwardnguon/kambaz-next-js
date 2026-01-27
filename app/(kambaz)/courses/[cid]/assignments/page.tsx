import Link from "next/link";

export default function Assignments() {
  return (
    <div id="wd-assignments">
      <input placeholder="Search for Assignments"
        id="wd-search-assignment" />
      <button id="wd-add-assignment-group">+ Group</button>
      <button id="wd-add-assignment">+ Assignment</button>
      <h3 id="wd-assignments-title">
        ASSIGNMENTS 40% of Total <button>+</button> </h3>
      <ul id="wd-assignment-list">
        <li className="wd-assignment-list-item">
          <Link href="/courses/1234/assignments/123"
            className="wd-assignment-link" >
            A1 - ENV + HTML
          </Link> </li>
        <li className="wd-assignment-list-item">
          <Link href="/courses/1234/assignments/124"
            className="wd-assignment-link" >
            A2 - CSS + BOOTSTRAP
          </Link> </li>
        <li className="wd-assignment-list-item">
          <Link href="/courses/1234/assignments/125"
            className="wd-assignment-link" >
            A3 - JAVASCRIPT + REACT
          </Link> </li>
      </ul>
      <h3 id="wd-quizzes-title">
        QUIZZES 21% of Total <button>+</button> </h3>
      <ul id="wd-quizzes-list">
        <li className="wd-quiz-list-item">Q1 - HTML</li>
        <li className="wd-quiz-list-item">Q2 - CSS</li>
        <li className="wd-quiz-list-item">Q3 - JavaScript</li>
      </ul>
      <h3 id="wd-exams-title">
        EXAMS 25% of Total <button>+</button> </h3>
      <ul id="wd-exams-list">
        <li className="wd-exam-list-item">Midterm Exam</li>
        <li className="wd-exam-list-item">Final Exam</li>
      </ul>
      <h3 id="wd-project-title">
        PROJECT 14% of Total <button>+</button> </h3>
      <ul id="wd-project-list">
        <li className="wd-project-list-item">Team Project</li>
      </ul>
    </div>
);}
