"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Button, Card, Form, Alert, ProgressBar } from "react-bootstrap";
import { FaArrowLeft, FaArrowRight, FaCheck, FaTimes } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { setCurrentQuiz } from "../../reducer";
import * as client from "../../../../client";

export default function QuizPreview() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const [quiz, setQuiz] = useState<any>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<{ [key: string]: any }>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  const fetchQuiz = async () => {
    const data = await client.findQuizById(qid as string);
    setQuiz(data);
    dispatch(setCurrentQuiz(data));
  };

  useEffect(() => {
    fetchQuiz();
  }, [qid]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <div className="text-center p-5">
        <Alert variant="info">
          This quiz has no questions yet.
        </Alert>
        <Button variant="secondary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}>
          Edit Quiz
        </Button>
      </div>
    );
  }

  const questions = quiz.questions;
  const currentQuestion = questions[currentQuestionIndex];
  const totalPoints = questions.reduce((sum: number, q: any) => sum + q.points, 0);

  const handleAnswerChange = (questionId: string, value: any) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const isQuestionCorrect = (question: any) => {
    const answer = answers[question._id];
    if (question.type === "MULTIPLE_CHOICE") {
      const correctChoice = question.choices?.find((c: any) => c.isCorrect);
      return correctChoice && answer === correctChoice._id;
    } else if (question.type === "TRUE_FALSE") {
      return answer === question.correctAnswer;
    } else if (question.type === "FILL_IN_BLANK") {
      const userAnswer = (answer || "").toLowerCase().trim();
      return question.blanks?.some((b: any) => b.text.toLowerCase().trim() === userAnswer);
    }
    return false;
  };

  const handleSubmit = () => {
    let totalScore = 0;
    questions.forEach((question: any) => {
      if (isQuestionCorrect(question)) {
        totalScore += question.points;
      }
    });
    setScore(totalScore);
    setSubmitted(true);
  };

  const renderQuestionCard = (question: any, index: number) => {
    const isCorrect = submitted ? isQuestionCorrect(question) : null;

    return (
      <Card key={question._id} className={`mb-4 ${submitted ? (isCorrect ? "border-success" : "border-danger") : ""}`}>
        <Card.Header className="d-flex justify-content-between align-items-center">
          <span>
            <strong>Question {index + 1}</strong>
            {submitted && (
              isCorrect ? <FaCheck className="text-success ms-2" /> : <FaTimes className="text-danger ms-2" />
            )}
          </span>
          <span>{question.points} pts</span>
        </Card.Header>
        <Card.Body>
          <p className="mb-4">{question.question}</p>

          {question.type === "MULTIPLE_CHOICE" && (
            <div>
              {question.choices?.map((choice: any) => (
                <Form.Check
                  key={choice._id}
                  type="radio"
                  id={`choice-${choice._id}`}
                  name={`question-${question._id}`}
                  label={choice.text}
                  checked={answers[question._id] === choice._id}
                  onChange={() => handleAnswerChange(question._id, choice._id)}
                  disabled={submitted}
                  className={`mb-2 ${submitted && choice.isCorrect ? "text-success fw-bold" : ""}`}
                />
              ))}
            </div>
          )}

          {question.type === "TRUE_FALSE" && (
            <div>
              <Form.Check
                type="radio"
                id={`true-${question._id}`}
                name={`question-${question._id}`}
                label="True"
                checked={answers[question._id] === true}
                onChange={() => handleAnswerChange(question._id, true)}
                disabled={submitted}
                className={`mb-2 ${submitted && question.correctAnswer === true ? "text-success fw-bold" : ""}`}
              />
              <Form.Check
                type="radio"
                id={`false-${question._id}`}
                name={`question-${question._id}`}
                label="False"
                checked={answers[question._id] === false}
                onChange={() => handleAnswerChange(question._id, false)}
                disabled={submitted}
                className={`mb-2 ${submitted && question.correctAnswer === false ? "text-success fw-bold" : ""}`}
              />
            </div>
          )}

          {question.type === "FILL_IN_BLANK" && (
            <div>
              <Form.Control
                type="text"
                placeholder="Your answer"
                value={answers[question._id] || ""}
                onChange={(e) => handleAnswerChange(question._id, e.target.value)}
                disabled={submitted}
              />
              {submitted && (
                <div className="mt-2 text-success">
                  <small>Correct answers: {question.blanks?.map((b: any) => b.text).join(", ")}</small>
                </div>
              )}
            </div>
          )}
        </Card.Body>
      </Card>
    );
  };

  return (
    <div id="wd-quiz-preview">
      <Alert variant="warning" className="mb-4">
        This is a preview of the published version of the quiz
      </Alert>

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3>{quiz.title}</h3>
        {submitted && (
          <div className="text-end">
            <h4>Score: {score} / {totalPoints}</h4>
            <ProgressBar
              now={(score / totalPoints) * 100}
              variant={score / totalPoints >= 0.7 ? "success" : score / totalPoints >= 0.5 ? "warning" : "danger"}
              style={{ width: "200px" }}
            />
          </div>
        )}
      </div>

      {quiz.oneQuestionAtATime ? (
        <>
          {renderQuestionCard(currentQuestion, currentQuestionIndex)}

          <div className="d-flex justify-content-between">
            <Button
              variant="secondary"
              disabled={currentQuestionIndex === 0}
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              <FaArrowLeft className="me-2" /> Previous
            </Button>

            <div className="d-flex gap-2">
              {questions.map((_: any, index: number) => (
                <Button
                  key={index}
                  variant={currentQuestionIndex === index ? "primary" : "outline-secondary"}
                  size="sm"
                  onClick={() => setCurrentQuestionIndex(index)}
                >
                  {index + 1}
                </Button>
              ))}
            </div>

            {currentQuestionIndex === questions.length - 1 ? (
              !submitted && (
                <Button variant="danger" onClick={handleSubmit}>
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
          {questions.map((question: any, index: number) => renderQuestionCard(question, index))}
          {!submitted && (
            <div className="text-end">
              <Button variant="danger" onClick={handleSubmit}>
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
        <Button variant="outline-primary" onClick={() => router.push(`/courses/${cid}/quizzes/${qid}/edit`)}>
          Keep Editing This Quiz
        </Button>
      </div>
    </div>
  );
}
