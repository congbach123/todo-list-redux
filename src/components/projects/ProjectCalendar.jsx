import React, { useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectFilteredTasks, selectUsers, updateTask } from '../../store/projectsSlice';
import TaskDetailModal from './TaskDetailModal';
import QuickAddTaskModal from './QuickAddTaskModal';

// date-fns imports
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval, getMonth, getYear, getDate, isToday, isSameDay, addMonths, subMonths, parseISO, isValid } from 'date-fns';

const ProjectCalendar = () => {
  const dispatch = useDispatch();
  const tasks = useSelector(selectFilteredTasks);
  const users = useSelector(selectUsers);

  // Get current date info using date-fns
  const today = new Date();
  const currentMonth = getMonth(today);
  const currentYear = getYear(today);

  // State for tracking displayed month/year
  const [displayDate, setDisplayDate] = useState(today);

  // Modal states
  const [selectedTask, setSelectedTask] = useState(null);
  const [showTaskDetail, setShowTaskDetail] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [quickAddDate, setQuickAddDate] = useState('');

  // Drag and drop states
  const [draggedTask, setDraggedTask] = useState(null);
  const [dragOverDay, setDragOverDay] = useState(null);
  const dragRef = useRef(null);

  // Hover states
  const [hoveredTask, setHoveredTask] = useState(null);

  // Navigation functions using date-fns
  const goToPrevMonth = () => {
    setDisplayDate(subMonths(displayDate, 1));
  };

  const goToNextMonth = () => {
    setDisplayDate(addMonths(displayDate, 1));
  };

  const goToCurrentMonth = () => {
    setDisplayDate(today);
  };

  // Generate calendar days using date-fns
  const getDaysInMonth = () => {
    const monthStart = startOfMonth(displayDate);
    const monthEnd = endOfMonth(displayDate);
    const calendarStart = startOfWeek(monthStart);
    const calendarEnd = endOfWeek(monthEnd);

    return eachDayOfInterval({
      start: calendarStart,
      end: calendarEnd,
    });
  };

  // Check if a day is in the current display month
  const isCurrentMonth = (day) => {
    return getMonth(day) === getMonth(displayDate);
  };

  // Get tasks for a specific day using date-fns
  const getTasksForDay = (day) => {
    const dayString = format(day, 'yyyy-MM-dd');

    return tasks.filter((task) => {
      if (!task.dueDate) return false;

      // Parse the task due date safely
      const taskDate = parseISO(task.dueDate);
      if (!isValid(taskDate)) return false;

      return isSameDay(taskDate, day);
    });
  };

  // Format day cell class using date-fns
  const getDayClass = (day) => {
    const isDragOver = dragOverDay && isSameDay(dragOverDay, day);
    const isCurrentMonthDay = isCurrentMonth(day);
    const isTodayDay = isToday(day);

    let classes = 'hover:bg-blue-50 transition-colors duration-200 cursor-pointer';

    if (!isCurrentMonthDay) {
      classes += ' text-gray-400 bg-gray-50';
    }

    if (isTodayDay) {
      classes += ' bg-indigo-50 border-indigo-200';
    }

    if (isDragOver) {
      classes += ' bg-green-100 border-green-300 border-2';
    }

    return classes;
  };

  // Get users by IDs
  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  // Handle task click
  const handleTaskClick = (e, task) => {
    e.stopPropagation();
    setSelectedTask(task);
    setShowTaskDetail(true);
  };

  // Handle day click using date-fns
  const handleDayClick = (day) => {
    const dateString = format(day, 'yyyy-MM-dd');
    setQuickAddDate(dateString);
    setShowQuickAdd(true);
  };

  // Handle task status change
  const handleStatusChange = (taskId, newStatus) => {
    dispatch(updateTask({ id: taskId, status: newStatus }));

    if (selectedTask && selectedTask.id === taskId) {
      setSelectedTask({ ...selectedTask, status: newStatus });
    }
  };

  // Drag and Drop handlers using date-fns
  const handleDragStart = (e, task) => {
    setDraggedTask(task);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', e.target.outerHTML);

    setTimeout(() => {
      e.target.style.opacity = '0.5';
    }, 0);
  };

  const handleDragEnd = (e) => {
    e.target.style.opacity = '1';
    setDraggedTask(null);
    setDragOverDay(null);
  };

  const handleDragOver = (e, day) => {
    e.preventDefault();
    if (!draggedTask) return;

    setDragOverDay(day);
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDragLeave = (e) => {
    if (!e.currentTarget.contains(e.relatedTarget)) {
      setDragOverDay(null);
    }
  };

  const handleDrop = (e, day) => {
    e.preventDefault();
    if (!draggedTask) return;

    const newDateString = format(day, 'yyyy-MM-dd');
    const currentDateString = draggedTask.dueDate;

    // Only update if the date is different
    if (currentDateString !== newDateString) {
      dispatch(
        updateTask({
          id: draggedTask.id,
          dueDate: newDateString,
        })
      );
    }

    setDraggedTask(null);
    setDragOverDay(null);
  };

  // Get task color based on status and priority
  const getTaskColor = (task) => {
    if (task.status === 'completed') return 'bg-green-100 text-green-800 border-green-200';
    if (task.status === 'in-progress') return 'bg-blue-100 text-blue-800 border-blue-200';
    if (task.priority === 'high') return 'bg-red-100 text-red-800 border-red-200';
    if (task.priority === 'normal') return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    return 'bg-gray-100 text-gray-800 border-gray-200';
  };

  // Format month name using date-fns
  const monthName = format(displayDate, 'MMMM yyyy');

  // Days of the week
  const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  // Get all calendar days
  const calendarDays = getDaysInMonth();

  return (
    <>
      <div className="mt-8">
        {/* Calendar Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-bold text-gray-900">{monthName}</h3>

          <div className="flex items-center space-x-2">
            <button
              onClick={goToPrevMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>

            <button
              onClick={goToCurrentMonth}
              className="px-4 py-2 text-sm font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
              Today
            </button>

            <button
              onClick={goToNextMonth}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors">
              <svg
                className="h-5 w-5 text-gray-500"
                viewBox="0 0 20 20"
                fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Calendar Grid */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-lg">
          {/* Weekday headers */}
          <div className="grid grid-cols-7 text-center py-3 border-b border-gray-200 bg-gray-50">
            {weekdays.map((day, index) => (
              <div
                key={index}
                className="text-sm font-semibold text-gray-600">
                {day}
              </div>
            ))}
          </div>

          {/* Calendar grid */}
          <div className="grid grid-cols-7 gap-px bg-gray-200">
            {calendarDays.map((day, index) => (
              <div
                key={format(day, 'yyyy-MM-dd')}
                className={`min-h-32 bg-white ${getDayClass(day)} p-2 relative`}
                onClick={() => handleDayClick(day)}
                onDragOver={(e) => handleDragOver(e, day)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, day)}>
                {/* Day number */}
                <div className="flex justify-between items-start mb-2">
                  <span className={`text-sm font-medium ${isToday(day) ? 'h-7 w-7 flex items-center justify-center rounded-full bg-indigo-600 text-white' : isCurrentMonth(day) ? 'text-gray-700' : 'text-gray-400'}`}>{getDate(day)}</span>

                  {/* Add task button (shows on hover) */}
                  {isCurrentMonth(day) && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDayClick(day);
                      }}
                      className="opacity-0 hover:opacity-100 p-1 rounded text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 4v16m8-8H4"
                        />
                      </svg>
                    </button>
                  )}
                </div>

                {/* Tasks */}
                {isCurrentMonth(day) && (
                  <div className="space-y-1 max-h-24 overflow-y-auto overflow-x-hidden">
                    {getTasksForDay(day).map((task) => {
                      const assignedUsers = getUsersByIds(task.assigneeIds);
                      const isHovered = hoveredTask === task.id;

                      return (
                        <div
                          key={task.id}
                          draggable
                          onDragStart={(e) => handleDragStart(e, task)}
                          onDragEnd={handleDragEnd}
                          onClick={(e) => handleTaskClick(e, task)}
                          onMouseEnter={() => setHoveredTask(task.id)}
                          onMouseLeave={() => setHoveredTask(null)}
                          className={`
                            group relative px-2 py-1 rounded text-xs border cursor-pointer
                            transform transition-all duration-200 hover:scale-102 hover:shadow-md
                            ${getTaskColor(task)}
                            ${isHovered ? 'z-10' : ''}
                            ${task.status === 'completed' ? 'opacity-75' : ''}
                          `}>
                          <div className="flex items-center justify-between">
                            <span className={`truncate font-medium ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</span>

                            {/* Priority indicator */}
                            {task.priority === 'high' && task.status !== 'completed' && <span className="text-red-500 text-xs">🔥</span>}
                          </div>

                          {/* Assignees */}
                          {assignedUsers.length > 0 && (
                            <div className="flex items-center mt-1 space-x-1">
                              <div className="flex -space-x-1">
                                {assignedUsers.slice(0, 2).map((user) => (
                                  <img
                                    key={user.id}
                                    src={user.avatar}
                                    alt={user.name}
                                    className="h-4 w-4 rounded-full border border-white"
                                    title={user.name}
                                  />
                                ))}
                                {assignedUsers.length > 2 && (
                                  <div className="h-4 w-4 rounded-full bg-gray-300 border border-white flex items-center justify-center">
                                    <span className="text-xs text-gray-600">+{assignedUsers.length - 2}</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Hover tooltip */}
                          {isHovered && (
                            <div className="absolute bottom-full left-0 mb-2 p-2 bg-black text-white text-xs rounded shadow-lg z-20 min-w-48 max-w-64">
                              <div className="font-medium">{task.title}</div>
                              {task.description && <div className="text-gray-300 mt-1">{task.description}</div>}
                              <div className="text-gray-400 mt-1">
                                {task.priority} priority • {task.status}
                              </div>
                              {assignedUsers.length > 0 && <div className="text-gray-400 mt-1">Assigned to: {assignedUsers.map((u) => u.name).join(', ')}</div>}
                              <div className="text-xs text-gray-500 mt-1">Due: {format(parseISO(task.dueDate), 'MMM d, yyyy')}</div>
                              <div className="text-xs text-gray-500 mt-1">Click to view • Drag to move</div>
                            </div>
                          )}

                          {/* Quick action buttons */}
                          <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 flex space-x-1 transition-opacity">
                            {task.status !== 'completed' && (
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleStatusChange(task.id, 'completed');
                                }}
                                className="p-1 bg-green-500 text-white rounded-full hover:bg-green-600 transform scale-75">
                                <svg
                                  className="h-3 w-3"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor">
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Empty day message */}
                {isCurrentMonth(day) && getTasksForDay(day).length === 0 && <div className="text-center text-gray-400 text-xs mt-4 opacity-0 hover:opacity-100 transition-opacity">Click to add task</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Legend */}
        <div className="mt-4 flex items-center justify-center space-x-6 text-xs text-gray-500">
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-red-100 border border-red-200 rounded"></div>
            <span>High Priority</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-blue-100 border border-blue-200 rounded"></div>
            <span>In Progress</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-green-100 border border-green-200 rounded"></div>
            <span>Completed</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="h-3 w-3 bg-yellow-100 border border-yellow-200 rounded"></div>
            <span>Normal/Pending</span>
          </div>
        </div>
      </div>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showTaskDetail}
        onClose={() => {
          setShowTaskDetail(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        users={users}
        onSave={() => {
          // Refresh data if needed
        }}
      />

      {/* Quick Add Task Modal */}
      <QuickAddTaskModal
        isOpen={showQuickAdd}
        onClose={() => {
          setShowQuickAdd(false);
          setQuickAddDate('');
        }}
        selectedDate={quickAddDate}
        users={users}
      />
    </>
  );
};

export default ProjectCalendar;
