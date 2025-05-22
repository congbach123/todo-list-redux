import React from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { selectTaskStats, selectProjects } from '../../store/projectsSlice';

const ProjectDashboard = () => {
  const stats = useSelector(selectTaskStats);
  const projects = useSelector(selectProjects);

  // chart data
  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#FBBF24' },
    { name: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
    { name: 'Completed', value: stats.completed, color: '#10B981' },
  ].filter((item) => item.value > 0);

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Project Dashboard</h2>
          <Link
            to="/projects"
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
                clipRule="evenodd"
              />
            </svg>
            View All Projects
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-r from-purple-500 to-indigo-600 rounded-xl p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Projects</h3>
            <p className="text-3xl font-bold">{projects.length}</p>
          </div>

          <div className="bg-gradient-to-r from-blue-500 to-teal-400 rounded-xl p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">Total Tasks</h3>
            <p className="text-3xl font-bold">{stats.total}</p>
            <div className="mt-2 flex space-x-4">
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-yellow-300 mr-1"></span>
                <span className="text-xs">{stats.pending} Pending</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-blue-300 mr-1"></span>
                <span className="text-xs">{stats.inProgress} In Progress</span>
              </div>
              <div className="flex items-center">
                <span className="h-3 w-3 rounded-full bg-green-300 mr-1"></span>
                <span className="text-xs">{stats.completed} Completed</span>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-red-500 to-pink-500 rounded-xl p-6 text-white shadow-md">
            <h3 className="text-lg font-semibold mb-2">High Priority</h3>
            <p className="text-3xl font-bold">{stats.highPriority}</p>
            {stats.overdue > 0 && (
              <p className="mt-2 text-sm">
                <span className="inline-flex items-center px-2 py-0.5 rounded bg-red-400 text-white text-xs">{stats.overdue} Overdue</span>
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Task Status Chart */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Task Status</h3>
            <div className="h-64">
              {stats.total > 0 ? (
                <ResponsiveContainer
                  width="100%"
                  height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value">
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={entry.color}
                        />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => [value, 'Tasks']} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center">
                  <p className="text-gray-500">No tasks available</p>
                </div>
              )}
            </div>
          </div>

          {/* Recent Projects */}
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <h3 className="text-lg font-medium text-gray-800 mb-4">Recent Projects</h3>
            <div className="space-y-3">
              {projects.length > 0 ? (
                projects.slice(0, 5).map((project) => (
                  <div
                    key={project.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium text-gray-800">{project.name}</h4>
                      {project.description && <p className="text-sm text-gray-500 truncate">{project.description}</p>}
                    </div>
                    <Link
                      to="/projects"
                      className="text-indigo-600 hover:text-indigo-800">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor">
                        <path
                          fillRule="evenodd"
                          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </Link>
                  </div>
                ))
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No projects available</p>
                  <Link
                    to="/projects"
                    className="mt-2 inline-block text-indigo-600 hover:text-indigo-800">
                    Create your first project
                  </Link>
                </div>
              )}
            </div>
            {projects.length > 5 && (
              <div className="mt-4 text-center">
                <Link
                  to="/projects"
                  className="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                  View all projects
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDashboard;
