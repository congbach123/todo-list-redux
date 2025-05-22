import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import WeatherCard from '../components/homePage/WeatherCard';
import QuoteCard from '../components/homePage/QuoteCard';
import FinancialChartCard from '../components/homePage/FinancialChartCard';
import ProjectDashboard from '../components/projects/ProjectDashboard';

const HomePage = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6">
          <div className="p-8">
            <h1 className="text-4xl font-bold text-center text-indigo-600 mb-2">Welcome to TaskBoard</h1>
            <p className="text-gray-600 text-center mb-8">Organize your tasks and projects efficiently with our easy-to-use application.</p>

            <div className="mt-6 max-w-md mx-auto">
              {isAuthenticated ? (
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/todos"
                    className="flex-1 py-3 px-4 border border-indigo-600 text-indigo-600 hover:bg-indigo-50 font-medium text-center rounded-lg transition duration-300 ease-in-out">
                    My Todos
                  </Link>
                  <Link
                    to="/projects"
                    className="flex-1 py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-center rounded-lg transition duration-300 ease-in-out transform hover:scale-105">
                    Projects & Tasks
                  </Link>
                </div>
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

        {/* Project Dashboard (Only for authenticated users) */}
        {isAuthenticated && (
          <div className="mb-6">
            <ProjectDashboard />
          </div>
        )}

        {/* Dashboard Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Weather Card */}
          <div className="transform transition duration-300 hover:scale-105">
            <WeatherCard />
          </div>

          {/* Daily Inspiration Card */}
          <div className="transform transition duration-300 hover:scale-105">
            <QuoteCard />
          </div>

          {/* Financial Chart Card */}
          <div className="transform transition duration-300 hover:scale-105 md:col-span-2 lg:col-span-1">
            <FinancialChartCard />
          </div>
        </div>

        {/* Footer */}
        <div className="mt-10 text-center text-gray-500 text-sm">
          <p>© 2025 TaskBoard. All rights reserved.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
