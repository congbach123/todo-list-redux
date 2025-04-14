import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted, setFilter } from '../../store/todosSlice';

const FilterButtons = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.todos.filter);

  return (
    <div className="flex flex-wrap items-center justify-between gap-2 py-4">
      <div className="flex flex-wrap gap-2">
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${filter === 'all' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => dispatch(setFilter('all'))}>
          All
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${filter === 'active' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
          onClick={() => dispatch(setFilter('active'))}>
          Active
        </button>
        <button
          className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-blue-500 ${
            filter === 'completed' ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
          onClick={() => dispatch(setFilter('completed'))}>
          Completed
        </button>
      </div>

      <button
        className="px-3 py-1.5 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-red-500"
        onClick={() => dispatch(clearCompleted())}>
        Clear Completed
      </button>
    </div>
  );
};

export default FilterButtons;
