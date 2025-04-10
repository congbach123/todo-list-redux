import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchText } from '../store/todosSlice';

const SearchTodo = () => {
  const dispatch = useDispatch();
  const searchText = useSelector((state) => state.todos.searchText);

  const handleSearch = (e) => {
    dispatch(setSearchText(e.target.value));
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search todos..."
        value={searchText || ''}
        onChange={handleSearch}
        className="search-input"
      />
      {searchText && (
        <button
          className="clear-search"
          onClick={() => dispatch(setSearchText(''))}>
          Clear
        </button>
      )}
    </div>
  );
};

export default SearchTodo;
