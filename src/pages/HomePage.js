import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="page home-page">
      <div className="home-container">
        <h1>Welcome to Todoist</h1>
        <p>Organize your tasks efficiently with our easy-to-use todo application.</p>

        <div className="home-actions">
          {isAuthenticated ? (
            <Link
              to="/todos"
              className="btn-primary">
              Go to My Todos
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="btn-primary">
                Login
              </Link>
              <Link
                to="/register"
                className="btn-secondary">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HomePage;
