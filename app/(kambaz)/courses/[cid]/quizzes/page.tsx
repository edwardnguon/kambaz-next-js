"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ListGroup, ListGroupItem, FormControl, InputGroup, Modal, Button, Dropdown } from "react-bootstrap";
import { BsGripVertical, BsSearch, BsPlus, BsRocket } from "react-icons/bs";
import { IoEllipsisVertical } from "react-icons/io5";
import { FaCheckCircle, FaBan, FaTrash, FaPencilAlt } from "react-icons/fa";
import { MdQuiz } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { setQuizzes, deleteQuiz as deleteQuizAction, publishQuiz as publishQuizAction } from "./reducer";
import { RootState } from "../../../store";
import * as client from "../../client";
import { formatQuizDateTime, getQuizAvailabilityStatus, parseQuizDate } from "./dateUtils";

export default function Quizzes() {
  const { cid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { quizzes } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [quizToDelete, setQuizToDelete] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [studentScores, setStudentScores] = useState<{ [quizId: string]: { score: number; total: number } | null }>({});

  const fetchQuizzes = async () => {
    const data = await client.findQuizzesForCourse(cid as string);
    dispatch(setQuizzes(data));
  };

  const fetchStudentScores = async (quizList: any[]) => {
    if (isFaculty) return;
    const scores: { [quizId: string]: { score: number; total: number } | null } = {};
    for (const quiz of quizList) {
      try {
        const attempt = await client.getLatestAttempt(quiz._id);
        if (attempt && attempt.submittedAt) {
          scores[quiz._id] = { score: attempt.score, total: attempt.totalPoints };
        } else {
          scores[quiz._id] = null;
        }
      } catch {
        scores[quiz._id] = null;
      }
    }
    setStudentScores(scores);
  };

  useEffect(() => {
    fetchQuizzes();
  }, []);

  useEffect(() => {
    if (!isFaculty && quizzes.length > 0) {
      fetchStudentScores(quizzes);
    }
  }, [quizzes, isFaculty]);

  const confirmDelete = (quiz: any) => {
    setQuizToDelete(quiz);
    setShowDeleteDialog(true);
  };

  const handleDelete = async () => {
    if (quizToDelete) {
      await client.deleteQuiz(quizToDelete._id);
      dispatch(deleteQuizAction(quizToDelete._id));
    }
    setShowDeleteDialog(false);
    setQuizToDelete(null);
  };

  const handleAddQuiz = async () => {
    const newQuiz = await client.createQuizForCourse(cid as string, {
      title: "Unnamed Quiz",
      description: "",
      quizType: "Graded Quiz",
      assignmentGroup: "Quizzes",
      shuffleAnswers: true,
      timeLimit: 20,
      hasTimeLimit: true,
      multipleAttempts: false,
      howManyAttempts: 1,
      showCorrectAnswers: "Immediately",
      accessCode: "",
      oneQuestionAtATime: true,
      webcamRequired: false,
      lockQuestionsAfterAnswering: false,
      published: false,
    });
    router.push(`/courses/${cid}/quizzes/${newQuiz._id}/edit`);
  };

  const handlePublish = async (quizId: string, published: boolean) => {
    await client.publishQuiz(quizId, published);
    dispatch(publishQuizAction({ quizId, published }));
  };

  // Sort quizzes by available date
  const sortedQuizzes = [...quizzes]
    .filter((q: any) => isFaculty || q.published)
    .filter((q: any) => q.title.toLowerCase().includes(searchTerm.toLowerCase()))
    .sort((a: any, b: any) => {
      const dateA = a.availableDate ? parseQuizDate(a.availableDate)?.getTime() || 0 : 0;
      const dateB = b.availableDate ? parseQuizDate(b.availableDate)?.getTime() || 0 : 0;
      return dateA - dateB;
    });

  return (
    <div id="wd-quizzes">
      <Modal show={showDeleteDialog} onHide={() => setShowDeleteDialog(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove the quiz &quot;{quizToDelete?.title}&quot;?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteDialog(false)}>No</Button>
          <Button variant="danger" onClick={handleDelete}>Yes</Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex justify-content-between mb-3">
        <InputGroup className="w-50">
          <InputGroup.Text><BsSearch /></InputGroup.Text>
          <FormControl
            placeholder="Search for Quiz"
            id="wd-search-quiz"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </InputGroup>
        {isFaculty && (
          <div>
            <button className="btn btn-danger" onClick={handleAddQuiz}>
              <BsPlus className="fs-5" />Quiz
            </button>
          </div>
        )}
      </div>

      {sortedQuizzes.length === 0 ? (
        <div className="text-center text-muted p-5">
          <MdQuiz className="fs-1 mb-3" />
          <p>No quizzes available.</p>
          {isFaculty && <p>Click the <strong>+ Quiz</strong> button to create a new quiz.</p>}
        </div>
      ) : (
        <ListGroup className="rounded-0" id="wd-quiz-list">
          <ListGroupItem className="p-0 mb-5 fs-5 border-gray">
            <div className="wd-title p-3 ps-2 bg-secondary">
              <BsGripVertical className="me-2 fs-3" /> Assignment Quizzes
            </div>
            <ListGroup className="rounded-0">
              {sortedQuizzes.map((quiz: any) => (
                <ListGroupItem key={quiz._id} className="wd-lesson p-3 ps-1">
                  <div className="d-flex align-items-center">
                    <BsGripVertical className="me-2 fs-3" />
                    <BsRocket className="me-3 fs-3 text-success" />
                    <div className="flex-fill">
                      <Link
                        href={`/courses/${cid}/quizzes/${quiz._id}`}
                        className="text-decoration-none text-dark fw-bold"
                      >
                        {quiz.title}
                      </Link>
                      <br />
                      <span className="text-muted small">
                        <strong>{getQuizAvailabilityStatus(quiz)}</strong>
                        {quiz.dueDate && <> | <strong>Due</strong> {formatQuizDateTime(quiz.dueDate)}</>}
                        {" | "}{quiz.points || 0} pts | {quiz.questions?.length || 0} Questions
                        {!isFaculty && studentScores[quiz._id] && (
                          <> | <strong>Score:</strong> {studentScores[quiz._id]?.score} / {studentScores[quiz._id]?.total}</>
                        )}
                      </span>
                    </div>
                    <div className="float-end d-flex align-items-center">
                      {isFaculty && (
                        <>
                          {quiz.published ? (
                            <FaCheckCircle
                              className="text-success me-2 fs-5"
                              style={{ cursor: "pointer" }}
                              onClick={() => handlePublish(quiz._id, false)}
                              title="Click to unpublish"
                            />
                          ) : (
                            <FaBan
                              className="text-secondary me-2 fs-5"
                              style={{ cursor: "pointer" }}
                              onClick={() => handlePublish(quiz._id, true)}
                              title="Click to publish"
                            />
                          )}
                          <Dropdown>
                            <Dropdown.Toggle variant="link" className="text-dark p-0" id={`dropdown-${quiz._id}`}>
                              <IoEllipsisVertical className="fs-4" />
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                              <Dropdown.Item onClick={() => router.push(`/courses/${cid}/quizzes/${quiz._id}/edit`)}>
                                <FaPencilAlt className="me-2" /> Edit
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => confirmDelete(quiz)}>
                                <FaTrash className="me-2 text-danger" /> Delete
                              </Dropdown.Item>
                              <Dropdown.Item onClick={() => handlePublish(quiz._id, !quiz.published)}>
                                {quiz.published ? (
                                  <><FaBan className="me-2" /> Unpublish</>
                                ) : (
                                  <><FaCheckCircle className="me-2" /> Publish</>
                                )}
                              </Dropdown.Item>
                            </Dropdown.Menu>
                          </Dropdown>
                        </>
                      )}
                    </div>
                  </div>
                </ListGroupItem>
              ))}
            </ListGroup>
          </ListGroupItem>
        </ListGroup>
      )}
    </div>
  );
}
