import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSortOption } from '../../store/todosSlice';

const SortTodos = () => {
  const dispatch = useDispatch();
  const sortOption = useSelector((state) => state.todos.sortOption);

  const handleSortChange = (e) => {
    dispatch(setSortOption(e.target.value));
  };

  return (
    <div className="flex items-center space-x-2">
      <label
        htmlFor="sort-select"
        className="text-sm font-medium text-gray-700">
        Sort by:
      </label>
      <div className="relative">
        <select
          id="sort-select"
          value={sortOption || 'default'}
          onChange={handleSortChange}
          className="block w-full pl-3 pr-10 py-2 text-sm border border-gray-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none">
          <option value="default">Default (Date added)</option>
          <option value="alphabetical">Alphabetical (A-Z)</option>
          <option value="alphabetical-reverse">Alphabetical (Z-A)</option>
          <option value="completed-first">Completed first</option>
          <option value="active-first">Active first</option>
          <option value="due-date">Due date</option>
        </select>
        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
          <svg
            className="h-4 w-4"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor">
            <path
              fillRule="evenodd"
              d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default SortTodos;
