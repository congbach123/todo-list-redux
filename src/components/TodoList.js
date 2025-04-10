import React from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  toggleTodo,
  deleteTodo,
  selectFilteredTodos,
} from "../features/todosSlice";
function TodoList() {
  const todos = useSelector(selectFilteredTodos);
  const dispatch = useDispatch();
  return (
    <ul>
      {todos.map((todo) => (
        <li key={todo.id} className={todo.completed ? "completed" : ""}>
          <span className="todo-text">{todo.text}</span>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => dispatch(toggleTodo(todo.id))}
          ></input>
          <button className="" onClick={() => dispatch(deleteTodo(todo.id))}>
            x
          </button>
        </li>
      ))}
      {todos.length === 0 && <li>No todos available</li>}
    </ul>
  );
}

export default TodoList;
