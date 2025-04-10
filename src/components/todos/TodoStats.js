import React from 'react';
import { useSelector } from 'react-redux';
import { selectTodosCount, selectFilteredTodos } from '../../store/todosSlice';

const TodoStats = () => {
  const counts = useSelector(selectTodosCount);
  const filteredTodos = useSelector(selectFilteredTodos);
  const searchText = useSelector((state) => state.todos.searchText);
  const filter = useSelector((state) => state.todos.filter);

  return (
    <div className="todo-stats">
      <div className="counts">
        <span>Total: {counts.total}</span>
        <span>Active: {counts.active}</span>
        <span>Completed: {counts.completed}</span>
      </div>

      {searchText && (
        <div className="search-stats">
          <span>Search results: {filteredTodos.length} todos</span>
        </div>
      )}

      {filter !== 'all' && !searchText && (
        <div className="filter-stats">
          <span>
            Showing: {filteredTodos.length} {filter} todos
          </span>
        </div>
      )}
    </div>
  );
};

export default TodoStats;
