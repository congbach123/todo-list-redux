import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 flex flex-col justify-center items-center p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
        <div className="p-8">
          <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">Welcome to Todoist</h1>
          <p className="text-gray-600 text-center mb-8">Organize your tasks efficiently with our easy-to-use todo application.</p>

          <div className="mt-6">
            {isAuthenticated ? (
              <Link
                to="/todos"
                className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                Go to My Todos
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="block w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mb-4">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="block w-full py-3 px-4 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium text-center rounded-lg transition duration-300 ease-in-out">
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
