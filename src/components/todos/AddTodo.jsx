import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../../store/todosSlice';

const AddTodo = () => {
  const [title, setTitle] = useState('');
  const [text, setText] = useState('');
  const [dueDate, setDueDate] = useState('');
  const dispatch = useDispatch();

  const handleSubmit = (e) => {
    e.preventDefault();

    if (title.trim()) {
      dispatch(
        addTodo({
          title: title.trim(),
          text: text.trim(),
          dueDate: dueDate,
        })
      );

      // Reset form fields
      setTitle('');
      setText('');
      setDueDate('');
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="mb-4">
        <input
          type="text"
          placeholder="Todo title (required)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>

      <div className="mb-4">
        <textarea
          placeholder="Todo description (optional)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          rows="2"
        />
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between space-y-3 sm:space-y-0 sm:space-x-4">
        <div className="w-full sm:w-auto">
          <label
            htmlFor="dueDate"
            className="block text-sm font-medium text-gray-700 mb-1">
            Due Date:
          </label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          className="w-full sm:w-auto px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors">
          Add Todo
        </button>
      </div>
    </form>
  );
};

export default AddTodo;
