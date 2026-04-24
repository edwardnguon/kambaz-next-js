"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Form, Alert, ProgressBar, Modal } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes, FaClock } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz } from "../../reducer";
import { RootState } from "../../../../../store";
import * as client from "../../../../client";

export default function TakeQuiz() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentQuiz } = useSelector((state: RootState) => state.quizzesReducer);
  const { currentUser } = useSelector((state: RootState) => state.accountReducer);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [attempt, setAttempt] = useState<any>(null);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [showSubmitModal, setShowSubmitModal] = useState(false);
  const [latestAttempt, setLatestAttempt] = useState<any>(null);
  const [viewingResults, setViewingResults] = useState(false);

  const fetchQuiz = async () => {
    const quiz = await client.findQuizById(qid as string);
    dispatch(setCurrentQuiz(quiz));
    return quiz;
  };

  const checkExistingAttempt = async () => {
    try {
      const existing = await client.getLatestAttempt(qid as string);
      if (existing && existing.submittedAt) {
        setLatestAttempt(existing);
        setViewingResults(true);
        // Restore answers for viewing
        const answerMap: { [key: string]: any } = {};
        existing.answers.forEach((a: any) => {
          answerMap[a.questionId] = a.answer;
        });
        setAnswers(answerMap);
        setSubmitted(true);
      }
      return existing;
    } catch (e) {
      return null;
    }
  };

  const startNewAttempt = async () => {
    try {
      const newAttempt = await client.startAttempt(qid as string);
      setAttempt(newAttempt);
      setViewingResults(false);
      setSubmitted(false);
      setAnswers({});
      return newAttempt;
    } catch (e: any) {
      alert(e.response?.data?.error || "Could not start quiz");
      router.push(`/courses/${cid}/quizzes/${qid}`);
      return null;
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      const quiz = await fetchQuiz();
      const existing = await checkExistingAttempt();

      if (existing?.submittedAt) {
        setLoading(false);
        return;
      }

      if (existing) {
        setAttempt(existing);
        setLoading(false);
        return;
      }

      // Check if can start new attempt
      const countData = await client.getAttemptCount(qid as string);
      if (!quiz.multipleAttempts && countData.count >= 1) {
        setLoading(false);
        return;
      }
      if (quiz.multipleAttempts && countData.count >= quiz.howManyAttempts) {
        setLoading(false);
        return;
      }

      await startNewAttempt();
      setLoading(false);
    };
    init();
  }, [qid]);

  // Timer effect
  useEffect(() => {
    if (!currentQuiz || !attempt || submitted || !currentQuiz.hasTimeLimit) return;

    const startTime = new Date(attempt.startedAt).getTime();
    const timeLimit = currentQuiz.timeLimit * 60 * 1000; // Convert to milliseconds
    const endTime = startTime + timeLimit;

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, Math.floor((endTime - now) / 1000));
      setTimeLeft(remaining);

      if (remaining <= 0) {
        handleSubmit();
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [currentQuiz, attempt, submitted]);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = async () => {
    if (!attempt || !currentQuiz) return;

    const answerArray = Object.entries(answers).map(([questionId, answer]) => ({
      questionId,
      answer,
    }));

    try {
      const result = await client.submitAttempt(attempt._id, answerArray);
      setLatestAttempt(result);
      setSubmitted(true);
      setShowSubmitModal(false);
    } catch (e) {
      alert("Failed to submit quiz");
    }
  };

  const handleRetake = async () => {
    setViewingResults(false);
    setAnswers({});
    await startNewAttempt();
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isQuestionCorrect = (questionId: string) => {
    if (!latestAttempt) return null;
    const answer = latestAttempt.answers.find((a: any) => a.questionId === questionId);
    return answer?.isCorrect;
  };

  if (loading) {
    return <div className="text-center p-5">Loading quiz...</div>;
  }

  if (!currentQuiz || !currentQuiz.questions || currentQuiz.questions.length === 0) {
    return (
      <div className="text-center p-5">
        <Alert variant="info">This quiz has no questions.</Alert>
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}>
          Back to Quiz
        </Button>
      </div>
    );
  }

  const questions = currentQuiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum: number, q: any) => sum + q.points, 0);

  // Check if user can retake
  const canRetake = () => {
    if (!currentQuiz.multipleAttempts) return false;
    if (!latestAttempt) return true;
    return latestAttempt.attemptNumber < currentQuiz.howManyAttempts;
  };

  return (
    <div id="wd-take-quiz">
      <Modal show={showSubmitModal} onHide={() => setShowSubmitModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Submit Quiz</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to submit this quiz? You won&apos;t be able to change your answers.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleSubmit}>Submit</Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{currentQuiz.title}</h3>
        <div className="d-flex align-items-center gap-4">
          {currentQuiz.hasTimeLimit && timeLeft !== null && !submitted && (
            <div className={`d-flex align-items-center ${timeLeft < 60 ? "text-danger" : ""}`}>
              <FaClock className="me-2" />
              <span className="fw-bold">{formatTime(timeLeft)}</span>
            </div>
          )}
          {submitted && latestAttempt && (
            <div className="text-end">
              <h4>Score: {latestAttempt.score} / {latestAttempt.totalPoints}</h4>
              <ProgressBar
                now={(latestAttempt.score / latestAttempt.totalPoints) * 100}
                variant={latestAttempt.score / latestAttempt.totalPoints >= 0.7 ? "success" : latestAttempt.score / latestAttempt.totalPoints >= 0.5 ? "warning" : "danger"}
                style={{ width: "200px" }}
              />
            </div>
          )}
        </div>
      </div>

      {submitted && (
        <Alert variant={latestAttempt?.score / latestAttempt?.totalPoints >= 0.7 ? "success" : "warning"}>
          Quiz submitted! Your score: {latestAttempt?.score} / {latestAttempt?.totalPoints} ({Math.round((latestAttempt?.score / latestAttempt?.totalPoints) * 100)}%)
        </Alert>
      )}

      {currentQuiz.oneQuestionAtATime ? (
        <>
          <Card className={`mb-4 ${submitted ? (isQuestionCorrect(currentQuestion._id) ? "border-success" : "border-danger") : ""}`}>
            <Card.Header className="d-flex justify-content-between align-items-center">
              <span>
                <strong>Question {currentQuestionIndex + 1}</strong>
                {submitted && (
                  isQuestionCorrect(currentQuestion._id) ?
                    <FaCheck className="text-success ms-2" /> :
                    <FaTimes className="text-danger ms-2" />
                )}
              </span>
              <span>{currentQuestion.points} pts</span>
            </Card.Header>
            <Card.Body>
              <p className="mb-4">{currentQuestion.question}</p>

              {currentQuestion.type === "MULTIPLE_CHOICE" && (
                <div>
                  {currentQuestion.choices?.map((choice: any) => (
                    <Form.Check
                      key={choice._id}
                      type="radio"
                      id={`choice-${choice._id}`}
                      name={`question-${currentQuestion._id}`}
                      label={choice.text}
                      checked={answers[currentQuestion._id] === choice._id}
                      onChange={() => handleAnswerChange(currentQuestion._id, choice._id)}
                      disabled={submitted}
                      className={`mb-2 ${submitted && choice.isCorrect ? "text-success fw-bold" : ""}`}
                    />
                  ))}
                </div>
              )}

              {currentQuestion.type === "TRUE_FALSE" && (
                <div>
                  <Form.Check
                    type="radio"
                    id={`true-${currentQuestion._id}`}
                    name={`question-${currentQuestion._id}`}
                    label="True"
                    checked={answers[currentQuestion._id] === true}
                    onChange={() => handleAnswerChange(currentQuestion._id, true)}
                    disabled={submitted}
                    className={`mb-2 ${submitted && currentQuestion.correctAnswer === true ? "text-success fw-bold" : ""}`}
                  />
                  <Form.Check
                    type="radio"
                    id={`false-${currentQuestion._id}`}
                    name={`question-${currentQuestion._id}`}
                    label="False"
                    checked={answers[currentQuestion._id] === false}
                    onChange={() => handleAnswerChange(currentQuestion._id, false)}
                    disabled={submitted}
                    className={`mb-2 ${submitted && currentQuestion.correctAnswer === false ? "text-success fw-bold" : ""}`}
                  />
                </div>
              )}

              {currentQuestion.type === "FILL_IN_BLANK" && (
                <div>
                  <Form.Control
                    type="text"
                    placeholder="Your answer"
                    value={answers[currentQuestion._id] || ""}
                    onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                    disabled={submitted}
                  />
                  {submitted && currentQuiz.showCorrectAnswers !== "Never" && (
                    <div className="mt-2 text-success">
                      <small>Correct answers: {currentQuestion.blanks?.map((b: any) => b.text).join(", ")}</small>
                    </div>
                  )}
                </div>
              )}
            </Card.Body>
          </Card>

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              <FaArrowLeft className="me-2" /> Previous
            </Button>

            <div className="d-flex gap-2 flex-wrap justify-content-center">
              {questions.map((_: any, index: number) => (
                <Button
                  key={index}
                  variant={currentQuestionIndex === index ? "primary" : answers[questions[index]._id] ? "success" : "outline-secondary"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              !submitted && (
                <Button variant="danger" onClick={() => setShowSubmitModal(true)}>
                  Submit Quiz
                </Button>
              )
            ) : (
              <Button
                variant="secondary"
                onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              >
                Next <FaArrowRight className="ms-2" />
              </Button>
            )}
          </div>
        </>
      ) : (
        <>
          {questions.map((q: any, i: number) => (
            <Card key={q._id} className={`mb-4 ${submitted ? (isQuestionCorrect(q._id) ? "border-success" : "border-danger") : ""}`}>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>
                  <strong>Question {i + 1}</strong>
                  {submitted && (
                    isQuestionCorrect(q._id) ?
                      <FaCheck className="text-success ms-2" /> :
                      <FaTimes className="text-danger ms-2" />
                  )}
                </span>
                <span>{q.points} pts</span>
              </Card.Header>
              <Card.Body>
                <p className="mb-4">{q.question}</p>

                {q.type === "MULTIPLE_CHOICE" && (
                  <div>
                    {q.choices?.map((choice: any) => (
                      <Form.Check
                        key={choice._id}
                        type="radio"
                        id={`choice-${choice._id}`}
                        name={`question-${q._id}`}
                        label={choice.text}
                        checked={answers[q._id] === choice._id}
                        onChange={() => handleAnswerChange(q._id, choice._id)}
                        disabled={submitted}
                        className={`mb-2 ${submitted && choice.isCorrect ? "text-success fw-bold" : ""}`}
                      />
                    ))}
                  </div>
                )}

                {q.type === "TRUE_FALSE" && (
                  <div>
                    <Form.Check
                      type="radio"
                      id={`true-${q._id}`}
                      name={`question-${q._id}`}
                      label="True"
                      checked={answers[q._id] === true}
                      onChange={() => handleAnswerChange(q._id, true)}
                      disabled={submitted}
                      className={`mb-2 ${submitted && q.correctAnswer === true ? "text-success fw-bold" : ""}`}
                    />
                    <Form.Check
                      type="radio"
                      id={`false-${q._id}`}
                      name={`question-${q._id}`}
                      label="False"
                      checked={answers[q._id] === false}
                      onChange={() => handleAnswerChange(q._id, false)}
                      disabled={submitted}
                      className={`mb-2 ${submitted && q.correctAnswer === false ? "text-success fw-bold" : ""}`}
                    />
                  </div>
                )}

                {q.type === "FILL_IN_BLANK" && (
                  <div>
                    <Form.Control
                      type="text"
                      placeholder="Your answer"
                      value={answers[q._id] || ""}
                      onChange={(e) => handleAnswerChange(q._id, e.target.value)}
                      disabled={submitted}
                    />
                    {submitted && currentQuiz.showCorrectAnswers !== "Never" && (
                      <div className="mt-2 text-success">
                        <small>Correct answers: {q.blanks?.map((b: any) => b.text).join(", ")}</small>
                      </div>
                    )}
                  </div>
                )}
              </Card.Body>
            </Card>
          ))}
          {!submitted && (
            <div className="text-end">
              <Button variant="danger" onClick={() => setShowSubmitModal(true)}>
                Submit Quiz
              </Button>
            </div>
          )}
        </>
      )}

      <hr className="my-4" />
      <div className="d-flex gap-2">
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}`)}>
          Back to Quiz Details
        </Button>
        {submitted && canRetake() && (
          <Button variant="primary" onClick={handleRetake}>
            Retake Quiz
          </Button>
        )}
      </div>
    </div>
  );
}
