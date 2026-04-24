import { configureStore } from "@reduxjs/toolkit";
import coursesReducer from "./courses/reducer";
import modulesReducer from "./courses/[cid]/modules/reducer";
import assignmentsReducer from "./courses/assignments/reducer";
import quizzesReducer from "./courses/[cid]/quizzes/reducer";
import accountReducer from "./account/reducer";
const store = configureStore({
  reducer: {
    coursesReducer,
    modulesReducer,
    assignmentsReducer,
    quizzesReducer,
    accountReducer,
  },
});
export type RootState = ReturnType<typeof store.getState>;
export default store;
