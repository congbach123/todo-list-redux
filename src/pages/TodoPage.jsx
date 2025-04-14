import React from 'react';
import AddTodo from '../components/todos/AddTodo';
import TodoList from '../components/todos/TodoList';
import FilterButtons from '../components/todos/FilterButtons';
import TodoStats from '../components/todos/TodoStats';
import SearchTodo from '../components/todos/SearchTodo';
import SortTodos from '../components/todos/SortTodos';

const TodoPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-6 sm:p-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-6">Todo List</h1>

            <div className="space-y-4 mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="w-full sm:w-2/3">
                  <SearchTodo />
                </div>
                <div className="w-full sm:w-auto">
                  <SortTodos />
                </div>
              </div>
            </div>

            <AddTodo />

            <TodoList />

            <div className="mt-6 space-y-6">
              <TodoStats />
              <FilterButtons />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
