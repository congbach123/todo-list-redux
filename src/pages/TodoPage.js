import React from 'react';
import AddTodo from '../components/todos/AddTodo';
import TodoList from '../components/todos/TodoList';
import FilterButtons from '../components/todos/FilterButtons';
import TodoStats from '../components/todos/TodoStats';
import SearchTodo from '../components/todos/SearchTodo';
import SortTodos from '../components/todos/SortTodos';

const TodoPage = () => {
  return (
    <div className="page todo-page">
      <div className="todo-app">
        <h1>Todo List</h1>
        <div className="todo-controls">
          <SearchTodo />
          <SortTodos />
        </div>
        <AddTodo />
        <TodoList />
        <div className="todo-footer">
          <TodoStats />
          <FilterButtons />
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
