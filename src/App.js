import React from 'react';
import AddTodo from './components/AddTodo';
import TodoList from './components/TodoList';
import FilterButtons from './components/FilterButtons';
import TodoStats from './components/TodoStats';
import './App.css';

function App() {
  return (
    <div className="todo-app">
      <h1>Todo List</h1>
      <AddTodo />
      <TodoList />
      <div className="todo-footer">
        <TodoStats />
        <FilterButtons />
      </div>
    </div>
  );
}

export default App;