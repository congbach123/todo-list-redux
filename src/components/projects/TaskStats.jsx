import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

const TaskStats = ({ stats }) => {
  // Data for chart
  const statusData = [
    { name: 'Pending', value: stats.pending, color: '#FBBF24' },
    { name: 'In Progress', value: stats.inProgress, color: '#3B82F6' },
    { name: 'Completed', value: stats.completed, color: '#10B981' },
  ];

  // Data for the priority chart
  const priorityData = [
    { name: 'High', value: stats.highPriority, color: '#EF4444' },
    { name: 'Normal/Low', value: stats.total - stats.highPriority, color: '#6B7280' },
  ];

  return (
    <div className="mt-4 bg-gray-50 rounded-lg p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-4">Task Overview</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {/* Stats cards */}
        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Total Tasks</h4>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
            {stats.total > 0 && (
              <div className="flex space-x-2">
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-yellow-400 mr-1"></span>
                  <span className="text-xs text-gray-500">{stats.pending}</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-blue-500 mr-1"></span>
                  <span className="text-xs text-gray-500">{stats.inProgress}</span>
                </div>
                <div className="flex items-center">
                  <span className="h-3 w-3 rounded-full bg-green-500 mr-1"></span>
                  <span className="text-xs text-gray-500">{stats.completed}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Priority</h4>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-red-600">{stats.highPriority}</p>
            <span className="text-sm text-gray-500">High Priority Tasks</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Due Soon</h4>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-blue-600">{stats.dueSoon}</p>
            <span className="text-sm text-gray-500">Due in Next 3 Days</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Overdue</h4>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-red-600">{stats.overdue}</p>
            <span className="text-sm text-gray-500">Past Due Date</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Assignment</h4>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-800">{stats.assigned}</p>
            <span className="text-sm text-gray-500">Assigned / {stats.unassigned} Unassigned</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
          <h4 className="text-sm font-medium text-gray-500 mb-1">Completion Rate</h4>
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-green-600">{stats.total > 0 ? Math.round((stats.completed / stats.total) * 100) : 0}%</p>
            <span className="text-sm text-gray-500">{stats.completed} Completed</span>
          </div>
        </div>
      </div>

      {stats.total > 0 && (
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Status chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Task Status</h4>
            <div className="h-64">
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
            </div>
          </div>

          {/* Priority chart */}
          <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-4">Task Priority</h4>
            <div className="h-64">
              <ResponsiveContainer
                width="100%"
                height="100%">
                <PieChart>
                  <Pie
                    data={priorityData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value">
                    {priorityData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                      />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => [value, 'Tasks']} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TaskStats;
