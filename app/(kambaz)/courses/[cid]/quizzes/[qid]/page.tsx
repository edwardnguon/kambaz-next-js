"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Table } from "react-bootstrap";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz, publishQuiz as publishQuizAction } from "../reducer";
import { RootState } from "../../../../store";
import * as client from "../../../client";
import { formatQuizDateTime, getQuizAvailabilityStatus, isQuizAvailableNow } from "../dateUtils";

export default function QuizDetails() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentQuiz } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const isFaculty = currentUser?.role === "FACULTY";
  const [attemptCount, setAttemptCount] = useState(0);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);

  const fetchQuiz = async () => {
    const quiz = await client.findQuizById(qid as string);
    dispatch(setCurrentQuiz(quiz));
  };

  const fetchAttemptData = async () => {
    try {
      const countData = await client.getAttemptCount(qid as string);
      setAttemptCount(countData.count);
      const attempt = await client.getLatestAttempt(qid as string);
      setLatestAttempt(attempt);
    } catch (e) {
      // Not authenticated or no attempts
    }
  };

  useEffect(() => {
    fetchQuiz();
    if (!isFaculty) {
      fetchAttemptData();
    }
  }, [qid]);

  const handlePublish = async () => {
    if (!currentQuiz) return;
    const newPublished = !currentQuiz.published;
    await client.publishQuiz(currentQuiz._id, newPublished);
    dispatch(publishQuizAction({ quizId: currentQuiz._id, published: newPublished }));
    dispatch(setCurrentQuiz({ ...currentQuiz, published: newPublished }));
  };

  const canTakeQuiz = () => {
    if (!currentQuiz) return false;
    if (!currentQuiz.published) return false;
    if (!isQuizAvailableNow(currentQuiz)) return false;
    if (!currentQuiz.multipleAttempts && attemptCount >= 1) return false;
    if (currentQuiz.multipleAttempts && attemptCount >= currentQuiz.howManyAttempts) return false;
    return true;
  };

  if (!currentQuiz) {
    return <div>Loading...</div>;
  }

  return (
    <div id="wd-quiz-details">
      {isFaculty && (
        <div className="d-flex justify-content-end mb-3 gap-2">
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/preview`)}
          >
            Preview
          </Button>
          <Button
            variant="outline-secondary"
            onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}
          >
            Edit
          </Button>
          <Button
            variant={currentQuiz.published ? "outline-danger" : "outline-success"}
            onClick={handlePublish}
          >
            {currentQuiz.published ? "Unpublish" : "Publish"}
          </Button>
        </div>
      )}

      <Card className="mb-4">
        <Card.Header>
          <h3>{currentQuiz.title}</h3>
          {!currentQuiz.published && (
            <span className="badge bg-secondary">Not Published</span>
          )}
        </Card.Header>
        <Card.Body>
          <Table borderless>
            <tbody>
              <tr>
                <td className="text-end fw-bold" style={{ width: "250px" }}>Quiz Type</td>
                <td>{currentQuiz.quizType}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Points</td>
                <td>{currentQuiz.points}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Assignment Group</td>
                <td>{currentQuiz.assignmentGroup}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Shuffle Answers</td>
                <td>{currentQuiz.shuffleAnswers ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Time Limit</td>
                <td>{currentQuiz.hasTimeLimit ? `${currentQuiz.timeLimit} Minutes` : "No time limit"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Multiple Attempts</td>
                <td>{currentQuiz.multipleAttempts ? `Yes (${currentQuiz.howManyAttempts} attempts)` : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">View Responses</td>
                <td>Always</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Show Correct Answers</td>
                <td>{currentQuiz.showCorrectAnswers}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">One Question at a Time</td>
                <td>{currentQuiz.oneQuestionAtATime ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Require Respondus LockDown Browser</td>
                <td>No</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Required to View Quiz Results</td>
                <td>No</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Webcam Required</td>
                <td>{currentQuiz.webcamRequired ? "Yes" : "No"}</td>
              </tr>
              <tr>
                <td className="text-end fw-bold">Lock Questions After Answering</td>
                <td>{currentQuiz.lockQuestionsAfterAnswering ? "Yes" : "No"}</td>
              </tr>
            </tbody>
          </Table>

          <Table bordered className="mt-4">
            <thead>
              <tr>
                <th>Due</th>
                <th>For</th>
                <th>Available from</th>
                <th>Until</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{formatQuizDateTime(currentQuiz.dueDate)}</td>
                <td>Everyone</td>
                <td>{formatQuizDateTime(currentQuiz.availableDate)}</td>
                <td>{formatQuizDateTime(currentQuiz.untilDate)}</td>
              </tr>
            </tbody>
          </Table>

          {currentQuiz.description && (
            <div className="mt-4">
              <h5>Description</h5>
              <div dangerouslySetInnerHTML={{ __html: currentQuiz.description }} />
            </div>
          )}
        </Card.Body>
      </Card>

      {!isFaculty && (
        <div className="text-center">
          {latestAttempt && (
            <div className="mb-3">
              <p>
                <strong>Last Attempt Score:</strong> {latestAttempt.score} / {latestAttempt.totalPoints}
              </p>
              <p>
                <strong>Attempts:</strong> {attemptCount}
                {currentQuiz.multipleAttempts && ` / ${currentQuiz.howManyAttempts}`}
              </p>
            </div>
          )}
          {canTakeQuiz() ? (
            <Button
              variant="danger"
              size="lg"
              onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/take`)}
            >
              {attemptCount > 0 ? "Retake Quiz" : "Start Quiz"}
            </Button>
          ) : (
            <p className="text-muted">
              {!currentQuiz.published
                ? "This quiz is not available yet."
                : !isQuizAvailableNow(currentQuiz)
                  ? getQuizAvailabilityStatus(currentQuiz)
                  : "You have used all your attempts for this quiz."}
            </p>
          )}
        </div>
      )}

      <div className="mt-4">
        <Button
          variant="secondary"
          onClick={() => router.push(`/courses/${cid}/quizzes`)}
        >
          Back to Quizzes
        </Button>
      </div>
    </div>
  );
}
