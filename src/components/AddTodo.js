import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../store/todosSlice';

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
      className="add-todo-form">
      <div className="form-group">
        <input
          type="text"
          placeholder="Todo title (required)..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="title-input"
          required
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Todo description (optional)..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="text-input"
          rows="2"
        />
      </div>

      <div className="form-row">
        <div className="date-input-container">
          <label htmlFor="dueDate">Due Date:</label>
          <input
            type="date"
            id="dueDate"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="date-input"
          />
        </div>

        <button
          type="submit"
          className="add-button">
          Add Todo
        </button>
      </div>
    </form>
  );
};

export default AddTodo;
