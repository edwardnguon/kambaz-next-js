"use client"
import { Provider } from "react-redux";
import store from "../store";
import HelloRedux from "../../redux/hello";
import CounterRedux from "../../redux/CounterRedux";
import AddRedux from "../../redux/AddRedux";
import TodoList from "../../redux/todos/TodoList";
export default function ReduxExamples() {
  return (
    <Provider store={store}>
      <div>
        <h2>Redux Examples</h2>
        <HelloRedux />
        <CounterRedux />
        <AddRedux />
        <TodoList />
      </div>
    </Provider>
  );
}
