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
    <header className="bg-gradient-to-r from-indigo-100 to-purple-100 py-4 px-4 shadow-md">
      <div className="flex justify-between items-center max-w-7xl mx-auto">
        <div className="text-indigo-600 text-2xl font-bold">
          <Link
            to="/"
            className="hover:text-indigo-800 transition duration-300">
            Baccon's TaskBoard
          </Link>
        </div>

        <nav className="flex items-center space-x-6">
          <Link
            to="/"
            className="text-gray-700 hover:text-indigo-600 font-medium transition duration-300">
            Home
          </Link>

          {isAuthenticated ? (
            <>
              <Link
                to="/todos"
                className="text-gray-700 hover:text-indigo-600 font-medium transition duration-300">
                Todos
              </Link>
              <Link
                to="/projects"
                className="text-gray-700 hover:text-indigo-600 font-medium transition duration-300">
                Projects
              </Link>
              <Link
                to="/taskboard"
                className="text-gray-700 hover:text-indigo-600 font-medium transition duration-300">
                TaskBoard
              </Link>
              <div className="flex items-center space-x-4">
                <span className="text-gray-700 font-medium">{user?.name || user?.username}</span>
                <button
                  onClick={handleLogout}
                  className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-300 ease-in-out">
                  Logout
                </button>
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-gray-700 hover:text-indigo-600 font-medium transition duration-300">
                Login
              </Link>
              <Link
                to="/register"
                className="py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg transition duration-300 ease-in-out">
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
