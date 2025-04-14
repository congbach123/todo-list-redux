import React from 'react';
import { useSelector } from 'react-redux';
import { selectTodosCount, selectFilteredTodos } from '../../store/todosSlice';

const TodoStats = () => {
  const counts = useSelector(selectTodosCount);
  const filteredTodos = useSelector(selectFilteredTodos);
  const searchText = useSelector((state) => state.todos.searchText);
  const filter = useSelector((state) => state.todos.filter);

  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-6">
      <div className="flex flex-wrap gap-4 text-sm">
        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-gray-500 mr-2"></div>
          <span className="font-medium text-gray-700">Total: </span>
          <span className="ml-1 text-gray-800">{counts.total}</span>
        </div>

        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-blue-500 mr-2"></div>
          <span className="font-medium text-gray-700">Active: </span>
          <span className="ml-1 text-gray-800">{counts.active}</span>
        </div>

        <div className="flex items-center">
          <div className="h-2 w-2 rounded-full bg-green-500 mr-2"></div>
          <span className="font-medium text-gray-700">Completed: </span>
          <span className="ml-1 text-gray-800">{counts.completed}</span>
        </div>
      </div>

      {searchText && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <svg
              className="h-4 w-4 text-gray-500 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-gray-700">Search results: </span>
            <span className="ml-1 text-gray-800">{filteredTodos.length} todos</span>
          </div>
        </div>
      )}

      {filter !== 'all' && !searchText && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <div className="flex items-center text-sm">
            <svg
              className="h-4 w-4 text-gray-500 mr-2"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="font-medium text-gray-700">Showing: </span>
            <span className="ml-1 text-gray-800">
              {filteredTodos.length} {filter} todos
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default TodoStats;
