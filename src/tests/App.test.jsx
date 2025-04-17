// src/App.test.jsx
import { render, screen } from '@testing-library/react';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import todosReducer from '../store/todosSlice';
import authReducer from '../store/authSlice';
import App from '@/App';

const createTestStore = () =>
  configureStore({
    reducer: {
      todos: todosReducer,
      auth: authReducer,
    },
  });

test('renders homepage content', () => {
  // Create test store
  const store = createTestStore();

  // Render redux need provider
  render(
    <Provider store={store}>
      <App />
    </Provider>
  );
  // check welcome exist
  const welcomeElement = screen.getByText(/Welcome to Todoist/i);
  expect(welcomeElement).toBeInTheDocument();
});
