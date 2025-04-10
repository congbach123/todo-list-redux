import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { toggleTodo, deleteTodo, selectFilteredTodos } from '../../store/todosSlice';

function TodoList() {
  const todos = useSelector(selectFilteredTodos);
  const dispatch = useDispatch();

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  return (
    <ul className="todo-list">
      {todos.map((todo) => (
        <li
          key={todo.id}
          className={todo.completed ? 'todo-item completed' : 'todo-item'}>
          <div className="todo-content">
            <h3 className="todo-title">{todo.title}</h3>

            {todo.text && <p className="todo-text">{todo.text}</p>}

            {todo.dueDate && <div className="todo-date">Due: {formatDate(todo.dueDate)}</div>}
          </div>

          <div className="todo-actions">
            <input
              type="checkbox"
              checked={todo.completed}
              onChange={() => dispatch(toggleTodo(todo.id))}
              className="todo-checkbox"
            />
            <button
              className="delete-button"
              onClick={() => dispatch(deleteTodo(todo.id))}>
              Delete
            </button>
          </div>
        </li>
      ))}

      {todos.length === 0 && <li className="empty-message">No todos available</li>}
    </ul>
  );
}

export default TodoList;
