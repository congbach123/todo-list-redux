// src/tests/test-utils.js
import React from 'react';
import { render as rtlRender } from '@testing-library/react';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import todosReducer from '../store/todosSlice';
import authReducer from '../store/authSlice';

function render(
  ui,
  {
    preloadedState,
    store = configureStore({
      reducer: {
        todos: todosReducer,
        auth: authReducer,
      },
      preloadedState,
    }),
    ...renderOptions
  } = {}
) {
  function Wrapper({ children }) {
    return <Provider store={store}>{children}</Provider>;
  }

  return {
    store,
    ...rtlRender(ui, { wrapper: Wrapper, ...renderOptions }),
  };
}

// re-export everything
export * from '@testing-library/react';
// override render method
export { render };
