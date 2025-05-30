import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from '@layout/Header';
import AuthLoadingScreen from '@layout/AuthLoadingScreen';
import HomePage from '@pages/HomePage';
import LoginPage from '@pages/LoginPage';
import RegisterPage from '@pages/RegisterPage';
import TodoPage from '@pages/TodoPage';
import ProjectsPage from '@pages/ProjectsPage';
import TaskBoardPage from '@pages/TaskBoardPage';
import '@/App.css';

function App() {
  return (
    <Router basename="/todo-list-redux">
      <div className="app">
        <Header />
        <main className="main-content">
          <Routes>
            <Route
              path="/"
              element={<HomePage />}
            />
            <Route
              path="/login"
              element={<LoginPage />}
            />
            <Route
              path="/register"
              element={<RegisterPage />}
            />

            {/* Protected routes */}
            <Route element={<AuthLoadingScreen />}>
              <Route
                path="/todos"
                element={<TodoPage />}
              />
              <Route
                path="/projects"
                element={<ProjectsPage />}
              />
              <Route
                path="/taskboard"
                element={<TaskBoardPage />}
              />
            </Route>
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
