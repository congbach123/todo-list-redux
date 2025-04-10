import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addTodo } from '../features/todosSlice'; // Adjust the import path as necessary

const AddTodo = ({ onAdd }) => {
  const [text, setText] = useState('');
  const dispatch = useDispatch();


  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim()) {
      dispatch(addTodo(text.trim()));
      setText('');
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Add a new todo here..."
        value={text}
        onChange={(e) => setText(e.target.value)}
        
      />
      <button type="submit">Add</button>
    </form>
  );
};

export default AddTodo;