"use client";
import { useTodos } from "./todosContext";
import { ListGroup, ListGroupItem, FormControl, Button } from "react-bootstrap";

export default function ReactContextTodoList() {
  const { todos, todo, addTodo, deleteTodo, updateTodo, setTodo } = useTodos();
  return (
    <div id="wd-react-context-todo-list">
      <h2>Todo List</h2>
      <ListGroup>
        <ListGroupItem>
          <Button onClick={() => addTodo(todo)} id="wd-add-todo-click"> Add </Button>
          <Button onClick={() => updateTodo(todo)} id="wd-update-todo-click"> Update </Button>
          <FormControl value={todo.title}
            onChange={(e) => setTodo({ ...todo, title: e.target.value })} />
        </ListGroupItem>
        {todos.map((t: any) => (
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
