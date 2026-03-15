"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";

interface Todo {
  id: string;
  title: string;
}

interface TodosContextState {
  todos: Todo[];
  todo: Todo;
  addTodo: (todo: Todo) => void;
  deleteTodo: (id: string) => void;
  updateTodo: (todo: Todo) => void;
  setTodo: (todo: Todo) => void;
}

const TodosContext = createContext<TodosContextState | undefined>(undefined);

export function TodosProvider({ children }: { children: React.ReactNode }) {
  const [todos, setTodos] = useState<Todo[]>([
    { id: "1", title: "Learn React" },
    { id: "2", title: "Learn Node" },
  ]);
  const [todo, setTodo] = useState<Todo>({ id: "-1", title: "Learn Mongo" });

  const addTodo = (newTodo: Todo) => {
    setTodos([...todos, { ...newTodo, id: new Date().getTime().toString() }]);
    setTodo({ id: "-1", title: "" });
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter((t) => t.id !== id));
  };

  const updateTodo = (updatedTodo: Todo) => {
    setTodos(todos.map((t) => (t.id === updatedTodo.id ? updatedTodo : t)));
    setTodo({ id: "-1", title: "" });
  };

  const value: TodosContextState = {
    todos,
    todo,
    addTodo,
    deleteTodo,
    updateTodo,
    setTodo,
  };

  return React.createElement(
    TodosContext.Provider,
    { value },
    children
  );
}

export const useTodos = () => {
  const context = useContext(TodosContext);
  return context!;
};
