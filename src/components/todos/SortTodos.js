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
    <div className="sort-container">
      <label htmlFor="sort-select">Sort by: </label>
      <select
        id="sort-select"
        value={sortOption || 'default'}
        onChange={handleSortChange}
        className="sort-select">
        <option value="default">Default (Date added)</option>
        <option value="alphabetical">Alphabetical (A-Z)</option>
        <option value="alphabetical-reverse">Alphabetical (Z-A)</option>
        <option value="completed-first">Completed first</option>
        <option value="active-first">Active first</option>
        <option value="due-date">Due date</option>
      </select>
    </div>
  );
};

export default SortTodos;
