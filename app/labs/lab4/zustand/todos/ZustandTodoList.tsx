"use client";
import { useTodoStore } from "./useTodoStore";
import { ListGroup, ListGroupItem, FormControl, Button } from "react-bootstrap";

export default function ZustandTodoList() {
  const { todos, todo, addTodo, deleteTodo, updateTodo, setTodo, setTodoTitle } =
    useTodoStore((state) => state);

  return (
    <div id="wd-zustand-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroupItem>
          <Button onClick={addTodo} id="wd-add-todo-click"> Add </Button>
          <Button onClick={updateTodo} id="wd-update-todo-click"> Update </Button>
          <FormControl value={todo.title}
            onChange={(e) => setTodoTitle(e.target.value)} />
        </ListGroupItem>
        {todos.map((t) => (
          <ListGroupItem key={t.id}>
            <Button onClick={() => deleteTodo(t.id)} id="wd-delete-todo-click"> Delete </Button>
            <Button onClick={() => setTodo(t)} id="wd-set-todo-click"> Edit </Button>
            {t.title}
          </ListGroupItem>
        ))}
      </ListGroup>
      <hr />
    </div>
  );
}
