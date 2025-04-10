import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { clearCompleted, setFilter, setSortBy, setSortDirection } from '../store/todosSlice';

const FilterButtons = () => {
  const dispatch = useDispatch();
  const filter = useSelector((state) => state.todos.filter);
  return (
    <div className="filter-buttons">
      <button
        className={filter === 'all' ? 'active' : ''}
        onClick={() => dispatch(setFilter('all'))}>
        All
      </button>
      <button
        className={filter === 'active' ? 'active' : ''}
        onClick={() => dispatch(setFilter('active'))}>
        Active
      </button>
      <button
        className={filter === 'completed' ? 'active' : ''}
        onClick={() => dispatch(setFilter('completed'))}>
        Completed
      </button>
      <button
        className="clear-completed"
        onClick={() => dispatch(clearCompleted())}>
        Clear Completed Todos
      </button>
    </div>
  );
};

export default FilterButtons;
