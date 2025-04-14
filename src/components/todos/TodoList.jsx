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
    <div className="mt-6 space-y-4">
      {todos.map((todo) => (
        <div
          key={todo.id}
          className={`p-4 rounded-lg shadow-sm border transition-all ${todo.completed ? 'bg-gray-50 border-gray-200' : 'bg-white border-gray-200 hover:border-blue-300'}`}>
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <h3 className={`text-lg font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-800'}`}>{todo.title}</h3>

              {todo.text && <p className={`mt-1 text-sm ${todo.completed ? 'text-gray-400' : 'text-gray-600'}`}>{todo.text}</p>}

              {todo.dueDate && <p className={`mt-2 text-xs font-medium ${todo.completed ? 'text-gray-400' : new Date(todo.dueDate) < new Date() ? 'text-red-500' : 'text-blue-500'}`}>Due: {formatDate(todo.dueDate)}</p>}
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => dispatch(toggleTodo(todo.id))}
                className="w-5 h-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />

              <button
                onClick={() => dispatch(deleteTodo(todo.id))}
                className="p-1 text-sm text-gray-500 hover:text-red-500 transition-colors focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      ))}

      {todos.length === 0 && (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-300"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <p className="mt-2 text-sm font-medium text-gray-500">No todos available</p>
        </div>
      )}
    </div>
  );
}

export default TodoList;
