import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';

const Header = () => {
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="header-container">
        <div className="logo">
          <Link to="/">Todo App</Link>
        </div>

        <nav className="nav-links">
          <Link
            to="/"
            className="nav-link">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/todos"
                className="nav-link">
                Todos
              </Link>
              <div className="auth-section">
                <span className="username">{user?.name || user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="logout-button">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="nav-link">
                Login
              </Link>
              <Link
                to="/register"
                className="nav-link">
                Register
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
