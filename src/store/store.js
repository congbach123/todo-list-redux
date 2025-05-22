import { configureStore } from '@reduxjs/toolkit';
import todosReducer from './todosSlice';
import authReducer from './authSlice';
import projectsReducer from './projectsSlice';

export const store = configureStore({
  reducer: {
    todos: todosReducer,
    auth: authReducer,
    projects: projectsReducer,
  },
});
