import { createSlice } from "@reduxjs/toolkit";

export interface Question {
  _id: string;
  title: string;
  type: "MULTIPLE_CHOICE" | "TRUE_FALSE" | "FILL_IN_BLANK";
  points: number;
  question: string;
  choices?: { _id: string; text: string; isCorrect: boolean }[];
  correctAnswer?: boolean;
  blanks?: { _id: string; text: string }[];
}

export interface Quiz {
  _id: string;
  title: string;
  course: string;
  description: string;
  quizType: string;
  assignmentGroup: string;
  shuffleAnswers: boolean;
  timeLimit: number;
  hasTimeLimit: boolean;
  multipleAttempts: boolean;
  howManyAttempts: number;
  showCorrectAnswers: string;
  accessCode: string;
  oneQuestionAtATime: boolean;
  webcamRequired: boolean;
  lockQuestionsAfterAnswering: boolean;
  dueDate: string;
  availableDate: string;
  untilDate: string;
  published: boolean;
  questions: Question[];
  points: number;
}

const initialState = {
  quizzes: [] as Quiz[],
  currentQuiz: null as Quiz | null,
};

const quizzesSlice = createSlice({
  name: "quizzes",
  initialState,
  reducers: {
    setQuizzes: (state, action) => {
      state.quizzes = action.payload;
    },
    setCurrentQuiz: (state, action) => {
      state.currentQuiz = action.payload;
    },
    addQuiz: (state, { payload: quiz }) => {
      state.quizzes = [...state.quizzes, quiz];
    },
    deleteQuiz: (state, { payload: quizId }) => {
      state.quizzes = state.quizzes.filter((q) => q._id !== quizId);
    },
    updateQuiz: (state, { payload: quiz }) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === quiz._id ? quiz : q
      );
      if (state.currentQuiz?._id === quiz._id) {
        state.currentQuiz = quiz;
      }
    },
    publishQuiz: (state, { payload: { quizId, published } }) => {
      state.quizzes = state.quizzes.map((q) =>
        q._id === quizId ? { ...q, published } : q
      );
      if (state.currentQuiz && state.currentQuiz._id === quizId) {
        state.currentQuiz.published = published;
      }
    },
  },
});

export const {
  setQuizzes,
  setCurrentQuiz,
  addQuiz,
  deleteQuiz,
  updateQuiz,
  publishQuiz,
} = quizzesSlice.actions;
export default quizzesSlice.reducer;
