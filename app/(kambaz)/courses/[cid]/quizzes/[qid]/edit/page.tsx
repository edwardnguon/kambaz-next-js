"use client";
import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Tab, Tabs, Form, Button, Row, Col, Card, ListGroup, Dropdown, Modal } from "react-bootstrap";
import { FaPlus, FaTrash, FaPencilAlt, FaCheck, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { setCurrentQuiz, updateQuiz as updateQuizAction, publishQuiz as publishQuizAction } from "../../reducer";
import { RootState } from "../../../../../store";
import * as client from "../../../../client";
import { v4 as uuidv4 } from "uuid";
import { formatDateTimeLocalValue } from "../../dateUtils";

export default function QuizEditor() {
  const { cid, qid } = useParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const { currentQuiz } = useSelector((state: RootState) => state.quizzesReducer);
  const [activeTab, setActiveTab] = useState("details");
  const [quiz, setQuiz] = useState<any>(null);
  const [editingQuestion, setEditingQuestion] = useState<string | null>(null);
  const [questionForm, setQuestionForm] = useState<any>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [questionToDelete, setQuestionToDelete] = useState<string | null>(null);

  const fetchQuiz = async () => {
    const data = await client.findQuizById(qid as string);
    setQuiz(data);
    dispatch(setCurrentQuiz(data));
  };

  useEffect(() => {
    fetchQuiz();
  }, [qid]);

  const buildPersistedQuiz = () => ({
    ...quiz,
    questions: (quiz.questions || [])
      .filter((q: any) => !q.isNew)
      .map(({ isNew, ...question }: any) => question),
  });

  const handleSave = async () => {
    const updatedQuiz = buildPersistedQuiz();
    updatedQuiz.points = (updatedQuiz.questions || []).reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    await client.updateQuiz(updatedQuiz);
    dispatch(updateQuizAction(updatedQuiz));
    router.push(`/courses/${cid}/quizzes/${qid}`);
  };

  const handleSaveAndPublish = async () => {
    const updatedQuiz = { ...buildPersistedQuiz(), published: true };
    updatedQuiz.points = (updatedQuiz.questions || []).reduce((sum: number, q: any) => sum + (q.points || 0), 0);
    await client.updateQuiz(updatedQuiz);
    await client.publishQuiz(quiz._id, true);
    dispatch(updateQuizAction(updatedQuiz));
    dispatch(publishQuizAction({ quizId: quiz._id, published: true }));
    router.push(`/courses/${cid}/quizzes`);
  };

  const handleCancel = () => {
    router.push(`/courses/${cid}/quizzes`);
  };

  const handleAddQuestion = () => {
    const newQuestion = {
      _id: uuidv4(),
      title: "New Question",
      type: "MULTIPLE_CHOICE",
      points: 1,
      question: "",
      choices: [
        { _id: uuidv4(), text: "Option 1", isCorrect: true },
        { _id: uuidv4(), text: "Option 2", isCorrect: false },
      ],
      correctAnswer: true,
      blanks: [{ _id: uuidv4(), text: "" }],
      isNew: true,
    };
    setQuiz({ ...quiz, questions: [...(quiz.questions || []), newQuestion] });
    setEditingQuestion(newQuestion._id);
    setQuestionForm(newQuestion);
  };

  const handleEditQuestion = (question: any) => {
    setEditingQuestion(question._id);
    setQuestionForm({ ...question, isNew: false });
  };

  const handleSaveQuestion = async () => {
    if (!questionForm) return;

    const { isNew, ...questionPayload } = questionForm;

    try {
      const updatedQuiz = isNew
        ? await client.addQuestion(quiz._id, questionPayload)
        : await client.updateQuestion(quiz._id, questionPayload);

      setQuiz(updatedQuiz);
      dispatch(updateQuizAction(updatedQuiz));
      setEditingQuestion(null);
      setQuestionForm(null);
    } catch {
      alert("Failed to save question");
    }
  };

  const handleCancelQuestion = () => {
    // If it's a new question that wasn't saved, remove it
    if (questionForm && !quiz.questions.find((q: any) => q._id === questionForm._id && q.question)) {
      setQuiz({
        ...quiz,
        questions: quiz.questions.filter((q: any) => q._id !== questionForm._id),
      });
    }
    setEditingQuestion(null);
    setQuestionForm(null);
  };

  const confirmDeleteQuestion = (questionId: string) => {
    setQuestionToDelete(questionId);
    setShowDeleteModal(true);
  };

  const handleDeleteQuestion = async () => {
    if (!questionToDelete) return;

    try {
      const updatedQuiz = await client.deleteQuestion(quiz._id, questionToDelete);
      setQuiz(updatedQuiz);
      dispatch(updateQuizAction(updatedQuiz));
      setShowDeleteModal(false);
      setQuestionToDelete(null);
    } catch {
      alert("Failed to delete question");
    }
  };

  const handleAddChoice = () => {
    setQuestionForm({
      ...questionForm,
      choices: [...questionForm.choices, { _id: uuidv4(), text: "", isCorrect: false }],
    });
  };

  const handleRemoveChoice = (choiceId: string) => {
    setQuestionForm({
      ...questionForm,
      choices: questionForm.choices.filter((c: any) => c._id !== choiceId),
    });
  };

  const handleAddBlank = () => {
    setQuestionForm({
      ...questionForm,
      blanks: [...questionForm.blanks, { _id: uuidv4(), text: "" }],
    });
  };

  const handleRemoveBlank = (blankId: string) => {
    setQuestionForm({
      ...questionForm,
      blanks: questionForm.blanks.filter((b: any) => b._id !== blankId),
    });
  };

  if (!quiz) {
    return <div>Loading...</div>;
  }

  const totalPoints = (quiz.questions || []).reduce((sum: number, q: any) => sum + (q.points || 0), 0);

  return (
    <div id="wd-quiz-editor">
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Delete Question</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this question?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>Cancel</Button>
          <Button variant="danger" onClick={handleDeleteQuestion}>Delete</Button>
        </Modal.Footer>
      </Modal>

      <div className="d-flex justify-content-between align-items-center mb-3">
        <h3>{quiz.title}</h3>
        <div>
          <span className="me-3">Points: {totalPoints}</span>
          <span className={quiz.published ? "text-success" : "text-secondary"}>
            {quiz.published ? "Published" : "Not Published"}
          </span>
        </div>
      </div>

      <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || "details")} className="mb-4">
        <Tab eventKey="details" title="Details">
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={quiz.title}
                onChange={(e) => setQuiz({ ...quiz, title: e.target.value })}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Quiz Instructions</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                value={quiz.description}
                onChange={(e) => setQuiz({ ...quiz, description: e.target.value })}
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Quiz Type</Form.Label>
                  <Form.Select
                    value={quiz.quizType}
                    onChange={(e) => setQuiz({ ...quiz, quizType: e.target.value })}
                  >
                    <option value="Graded Quiz">Graded Quiz</option>
                    <option value="Practice Quiz">Practice Quiz</option>
                    <option value="Graded Survey">Graded Survey</option>
                    <option value="Ungraded Survey">Ungraded Survey</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Points</Form.Label>
                  <Form.Control
                    type="number"
                    value={totalPoints}
                    readOnly
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Assignment Group</Form.Label>
                  <Form.Select
                    value={quiz.assignmentGroup}
                    onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                  >
                    <option value="Quizzes">Quizzes</option>
                    <option value="Exams">Exams</option>
                    <option value="Assignments">Assignments</option>
                    <option value="Project">Project</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}></Col>
            </Row>

            <Card className="mb-3">
              <Card.Header>Options</Card.Header>
              <Card.Body>
                <Form.Check
                  type="checkbox"
                  label="Shuffle Answers"
                  checked={quiz.shuffleAnswers}
                  onChange={(e) => setQuiz({ ...quiz, shuffleAnswers: e.target.checked })}
                  className="mb-2"
                />
                <div className="d-flex align-items-center mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Time Limit"
                    checked={quiz.hasTimeLimit}
                    onChange={(e) => setQuiz({ ...quiz, hasTimeLimit: e.target.checked })}
                  />
                  {quiz.hasTimeLimit && (
                    <div className="ms-3 d-flex align-items-center">
                      <Form.Control
                        type="number"
                        value={quiz.timeLimit}
                        onChange={(e) => setQuiz({ ...quiz, timeLimit: parseInt(e.target.value) || 0 })}
                        style={{ width: "80px" }}
                        className="me-2"
                      />
                      <span>Minutes</span>
                    </div>
                  )}
                </div>
                <div className="mb-2">
                  <Form.Check
                    type="checkbox"
                    label="Allow Multiple Attempts"
                    checked={quiz.multipleAttempts}
                    onChange={(e) => setQuiz({ ...quiz, multipleAttempts: e.target.checked })}
                  />
                  {quiz.multipleAttempts && (
                    <div className="ms-4 mt-2 d-flex align-items-center">
                      <span className="me-2">Number of attempts:</span>
                      <Form.Control
                        type="number"
                        value={quiz.howManyAttempts}
                        onChange={(e) => setQuiz({ ...quiz, howManyAttempts: parseInt(e.target.value) || 1 })}
                        style={{ width: "80px" }}
                        min={1}
                      />
                    </div>
                  )}
                </div>
                <Form.Check
                  type="checkbox"
                  label="One Question at a Time"
                  checked={quiz.oneQuestionAtATime}
                  onChange={(e) => setQuiz({ ...quiz, oneQuestionAtATime: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Webcam Required"
                  checked={quiz.webcamRequired}
                  onChange={(e) => setQuiz({ ...quiz, webcamRequired: e.target.checked })}
                  className="mb-2"
                />
                <Form.Check
                  type="checkbox"
                  label="Lock Questions After Answering"
                  checked={quiz.lockQuestionsAfterAnswering}
                  onChange={(e) => setQuiz({ ...quiz, lockQuestionsAfterAnswering: e.target.checked })}
                />
              </Card.Body>
            </Card>

            <Form.Group className="mb-3">
              <Form.Label>Show Correct Answers</Form.Label>
              <Form.Select
                value={quiz.showCorrectAnswers}
                onChange={(e) => setQuiz({ ...quiz, showCorrectAnswers: e.target.value })}
              >
                <option value="Immediately">Immediately</option>
                <option value="After Due Date">After Due Date</option>
                <option value="Never">Never</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Access Code</Form.Label>
              <Form.Control
                type="text"
                value={quiz.accessCode}
                onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                placeholder="Leave blank for no access code"
              />
            </Form.Group>

            <Row className="mb-3">
              <Col md={4}>
                  <Form.Group>
                    <Form.Label>Due Date</Form.Label>
                    <Form.Control
                    type="datetime-local"
                    value={formatDateTimeLocalValue(quiz.dueDate)}
                    onChange={(e) => setQuiz({ ...quiz, dueDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Available From</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formatDateTimeLocalValue(quiz.availableDate)}
                    onChange={(e) => setQuiz({ ...quiz, availableDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Until</Form.Label>
                  <Form.Control
                    type="datetime-local"
                    value={formatDateTimeLocalValue(quiz.untilDate)}
                    onChange={(e) => setQuiz({ ...quiz, untilDate: e.target.value })}
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Tab>

        <Tab eventKey="questions" title="Questions">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h5>Questions ({(quiz.questions || []).length})</h5>
            <Button variant="outline-primary" onClick={handleAddQuestion}>
              <FaPlus className="me-2" /> New Question
            </Button>
          </div>

          {(quiz.questions || []).length === 0 ? (
            <div className="text-center text-muted p-5">
              <p>No questions yet.</p>
              <p>Click <strong>+ New Question</strong> to add a question.</p>
            </div>
          ) : (
            <ListGroup>
              {(quiz.questions || []).map((question: any, index: number) => (
                <ListGroup.Item key={question._id} className="p-3">
                  {editingQuestion === question._id && questionForm ? (
                    // Edit Mode
                    <div>
                      <Row className="mb-3">
                        <Col md={5}>
                          <Form.Control
                            type="text"
                            placeholder="Question Title"
                            value={questionForm.title}
                            onChange={(e) => setQuestionForm({ ...questionForm, title: e.target.value })}
                          />
                        </Col>
                        <Col md={4}>
                          <Form.Select
                            value={questionForm.type}
                            onChange={(e) => setQuestionForm({ ...questionForm, type: e.target.value })}
                          >
                            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                            <option value="TRUE_FALSE">True/False</option>
                            <option value="FILL_IN_BLANK">Fill in the Blank</option>
                          </Form.Select>
                        </Col>
                        <Col md={3}>
                          <div className="d-flex align-items-center">
                            <span className="me-2">pts:</span>
                            <Form.Control
                              type="number"
                              value={questionForm.points}
                              onChange={(e) => setQuestionForm({ ...questionForm, points: parseInt(e.target.value) || 0 })}
                              style={{ width: "80px" }}
                              min={0}
                            />
                          </div>
                        </Col>
                      </Row>

                      <Form.Group className="mb-3">
                        <Form.Label>Question</Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={3}
                          value={questionForm.question}
                          onChange={(e) => setQuestionForm({ ...questionForm, question: e.target.value })}
                          placeholder="Enter your question here..."
                        />
                      </Form.Group>

                      {questionForm.type === "MULTIPLE_CHOICE" && (
                        <div className="mb-3">
                          <Form.Label>Answers</Form.Label>
                          {questionForm.choices.map((choice: any) => (
                            <div key={choice._id} className="d-flex align-items-center mb-2">
                              <Form.Check
                                type="radio"
                                name={`correct-${questionForm._id}`}
                                checked={choice.isCorrect}
                                onChange={() => {
                                  setQuestionForm({
                                    ...questionForm,
                                    choices: questionForm.choices.map((c: any) => ({
                                      ...c,
                                      isCorrect: c._id === choice._id,
                                    })),
                                  });
                                }}
                                className="me-2"
                              />
                              <span className={choice.isCorrect ? "text-success fw-bold me-2" : "me-2"}>
                                {choice.isCorrect ? "Correct Answer" : "Possible Answer"}
                              </span>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={choice.text}
                                onChange={(e) => {
                                  setQuestionForm({
                                    ...questionForm,
                                    choices: questionForm.choices.map((c: any) =>
                                      c._id === choice._id ? { ...c, text: e.target.value } : c
                                    ),
                                  });
                                }}
                                className="me-2"
                              />
                              <Button
                                variant="link"
                                className="text-danger p-0"
                                onClick={() => handleRemoveChoice(choice._id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          ))}
                          <Button variant="link" onClick={handleAddChoice}>
                            + Add Another Answer
                          </Button>
                        </div>
                      )}

                      {questionForm.type === "TRUE_FALSE" && (
                        <div className="mb-3">
                          <Form.Label>Correct Answer</Form.Label>
                          <div>
                            <Form.Check
                              type="radio"
                              label="True"
                              name={`tf-${questionForm._id}`}
                              checked={questionForm.correctAnswer === true}
                              onChange={() => setQuestionForm({ ...questionForm, correctAnswer: true })}
                              className="mb-2"
                            />
                            <Form.Check
                              type="radio"
                              label="False"
                              name={`tf-${questionForm._id}`}
                              checked={questionForm.correctAnswer === false}
                              onChange={() => setQuestionForm({ ...questionForm, correctAnswer: false })}
                            />
                          </div>
                        </div>
                      )}

                      {questionForm.type === "FILL_IN_BLANK" && (
                        <div className="mb-3">
                          <Form.Label>Possible Correct Answers</Form.Label>
                          {questionForm.blanks.map((blank: any) => (
                            <div key={blank._id} className="d-flex align-items-center mb-2">
                              <span className="me-2">Possible Answer</span>
                              <Form.Control
                                as="textarea"
                                rows={2}
                                value={blank.text}
                                onChange={(e) => {
                                  setQuestionForm({
                                    ...questionForm,
                                    blanks: questionForm.blanks.map((b: any) =>
                                      b._id === blank._id ? { ...b, text: e.target.value } : b
                                    ),
                                  });
                                }}
                                className="me-2"
                              />
                              <Button
                                variant="link"
                                className="text-danger p-0"
                                onClick={() => handleRemoveBlank(blank._id)}
                              >
                                <FaTrash />
                              </Button>
                            </div>
                          ))}
                          <Button variant="link" onClick={handleAddBlank}>
                            + Add Another Answer
                          </Button>
                        </div>
                      )}

                      <div className="d-flex gap-2">
                        <Button variant="secondary" onClick={handleCancelQuestion}>
                          Cancel
                        </Button>
                        <Button variant="danger" onClick={handleSaveQuestion}>
                          Update Question
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // View Mode
                    <div className="d-flex justify-content-between align-items-start">
                      <div>
                        <div className="d-flex align-items-center mb-2">
                          <strong className="me-2">Question {index + 1}:</strong>
                          <span>{question.title}</span>
                          <span className="badge bg-secondary ms-2">{question.type.replace("_", " ")}</span>
                          <span className="badge bg-primary ms-2">{question.points} pts</span>
                        </div>
                        <p className="mb-0 text-muted">{question.question || "(No question text)"}</p>
                      </div>
                      <div>
                        <Button
                          variant="link"
                          className="text-primary p-0 me-3"
                          onClick={() => handleEditQuestion(question)}
                        >
                          <FaPencilAlt /> Edit
                        </Button>
                        <Button
                          variant="link"
                          className="text-danger p-0"
                          onClick={() => confirmDeleteQuestion(question._id)}
                        >
                          <FaTrash /> Delete
                        </Button>
                      </div>
                    </div>
                  )}
                </ListGroup.Item>
              ))}
            </ListGroup>
          )}
        </Tab>
      </Tabs>

      <hr />
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={handleCancel}>
          Cancel
        </Button>
        <Button variant="primary" onClick={handleSave}>
          Save
        </Button>
        <Button variant="danger" onClick={handleSaveAndPublish}>
          Save & Publish
        </Button>
      </div>
    </div>
  );
}
