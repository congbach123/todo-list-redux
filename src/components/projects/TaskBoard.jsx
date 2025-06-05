import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Modal } from 'antd';
import { updateTask, deleteTask, selectUsers } from '@store/projectsSlice';
import UserAssignmentModal from './UserAssignmentModal';
import TaskDetailModal from './TaskDetailModal';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { UserOutlined, ScheduleOutlined } from '@ant-design/icons';

const TaskCard = ({ task, users, onEdit, onDelete, onAssign, onDuplicate, onMarkComplete, onMarkInProgress, onCardClick, isDragOverlay = false }) => {
  const [openDropdown, setOpenDropdown] = useState(false);

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: task.id,
    disabled: isDragOverlay,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.3 : 1,
  };

  const getUsersByIds = (userIds) => {
    if (!userIds || userIds.length === 0) return [];
    return users.filter((user) => userIds.includes(user.id));
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    if (date.toDateString() === today.toDateString()) {
      return 'Today';
    } else if (date.toDateString() === tomorrow.toDateString()) {
      return 'Tomorrow';
    }
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'text-red-600';
      case 'normal':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  const getPriorityFlag = (priority) => {
    switch (priority) {
      case 'high':
        return '🚩';
      case 'normal':
        return '🔵';
      case 'low':
        return '⚪';
      default:
        return '⚪';
    }
  };

  const assignedUsers = getUsersByIds(task.assigneeIds);
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.dropdown-container')) {
        setOpenDropdown(false);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [openDropdown]);

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={!isDragOverlay ? style : undefined}
      className={`bg-white rounded-lg shadow-md border border-gray-200 p-4 mb-3 hover:shadow-lg transition-shadow cursor-pointer ${isDragOverlay ? 'shadow-2xl opacity-80' : ''}`}
      onClick={() => !isDragOverlay && onCardClick(task)}>
      {/* Card Header */}
      <div className="flex items-start justify-between mb-3">
        <div
          {...(!isDragOverlay ? attributes : {})}
          {...(!isDragOverlay ? listeners : {})}
          onClick={(e) => e.stopPropagation()}
          className="flex items-start space-x-2 flex-1 cursor-grab active:cursor-grabbing">
          <h4 className="text-lg font-medium text-gray-900 flex-1 pr-2">{task.title}</h4>
        </div>

        {!isDragOverlay && (
          <div className="relative dropdown-container">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setOpenDropdown(!openDropdown);
              }}
              className="text-gray-400 hover:text-gray-600 p-1">
              <svg
                className="w-4 h-4"
                fill="currentColor"
                viewBox="0 0 20 20">
                <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
              </svg>
            </button>

            {openDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-20 border border-gray-200">
                <div className="py-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(task);
                      setOpenDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                      />
                    </svg>
                    Edit Task
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onAssign(task);
                      setOpenDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                      />
                    </svg>
                    Assign Users
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicate(task);
                      setOpenDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                    Duplicate Task
                  </button>

                  {task.status !== 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkComplete(task.id);
                        setOpenDropdown(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Mark Complete
                    </button>
                  )}

                  {task.status !== 'in-progress' && task.status !== 'completed' && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onMarkInProgress(task.id);
                        setOpenDropdown(false);
                      }}
                      className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left">
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      Start Progress
                    </button>
                  )}

                  <hr className="my-1" />

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(task);
                      setOpenDropdown(false);
                    }}
                    className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1-1H8a1 1 0 00-1 1v3M4 7h16"
                      />
                    </svg>
                    Delete Task
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="border-b-2 border-dotted border-dark-gray mb-4 text-lg"></div>

      {/* Assignees */}
      {assignedUsers.length > 0 && (
        <div className="flex items-center gap-2 mb-3">
          <UserOutlined
            style={{ fontSize: '16px' }}
            className="text-text-secondary"
          />
          <div className="flex -space-x-2">
            {assignedUsers.slice(0, 3).map((user) => (
              <img
                key={user.id}
                src={user.avatar}
                alt={user.name}
                className="w-6 h-6 rounded-full border-2 border-white"
                title={`${user.name} - ${user.email}`}
              />
            ))}
            {assignedUsers.length > 3 && (
              <div
                className="w-6 h-6 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center"
                title={`${assignedUsers.length - 3} more assignees: ${assignedUsers
                  .slice(3)
                  .map((u) => u.name)
                  .join(', ')}`}>
                <span className="text-xs font-medium text-gray-600">+{assignedUsers.length - 3}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Due Date */}
      <div className="flex items-center gap-2 mb-4 text-sm font-medium text-text-secondary">
        {task.dueDate && (
          <>
            <ScheduleOutlined
              style={{ fontSize: '16px' }}
              className="text-text-secondary"
            />
            <span className={isOverdue ? 'text-red-600 font-medium' : ''}>
              {formatDate(task.dueDate)}
              {isOverdue && ' Overdue'}
            </span>
          </>
        )}
      </div>

      {/* Priority */}
      <div className={`flex items-center gap-2 mb-4 text-sm font-medium text-text-secondary ${getPriorityColor(task.priority)}`}>
        <span className="">{getPriorityFlag(task.priority)}</span>
        <span className="capitalize">{task.priority} Priority</span>
      </div>
    </div>
  );
};

const TaskColumn = ({ title, tasks, status, statusColor, users, onAddTask, onEditTask, onDeleteTask, onAssignTask, onDuplicate, onMarkComplete, onMarkInProgress, onCardClick }) => {
  return (
    <div className="bg-light-gray rounded-lg p-2 min-h-96">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-2 ">
        <div className="flex items-center space-x-2 bg-dark-gray text-white p-2 rounded-md">
          <div className={`w-3 h-3 rounded-full ${statusColor}`}></div>
          <h3 className="font-medium text-gray-900">{title}</h3>
          <span className="text-sm text-gray-500">({tasks.length})</span>
        </div>
        <button
          onClick={() => onAddTask(status)}
          className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded"
          title={`Add task to ${title}`}>
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M12 4v16m8-8H4"
            />
          </svg>
        </button>
      </div>

      {/* Task Cards */}
      <SortableContext
        items={tasks.map((task) => task.id)}
        strategy={verticalListSortingStrategy}>
        <div className="space-y-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              users={users}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onAssign={onAssignTask}
              onDuplicate={onDuplicate}
              onMarkComplete={onMarkComplete}
              onMarkInProgress={onMarkInProgress}
              onCardClick={onCardClick}
            />
          ))}

          {tasks.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <svg
                className="w-8 h-8 mx-auto mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
              <p className="text-sm">No tasks</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  );
};

const TaskBoard = ({ tasksByStatus, users, onAddTask }) => {
  const dispatch = useDispatch();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [showAssignmentModal, setShowAssignmentModal] = useState(false);
  const [taskForAssignment, setTaskForAssignment] = useState(null);
  const [showTaskModal, setShowTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [activeTask, setActiveTask] = useState(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // Minimum distance before drag starts
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const taskId = active.id;

    // Find the task being dragged
    const allTasks = [...(tasksByStatus.pending || []), ...(tasksByStatus.inProgress || []), ...(tasksByStatus.completed || [])];

    const draggedTask = allTasks.find((task) => task.id === taskId);
    setActiveTask(draggedTask);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    // Clear the active task
    setActiveTask(null);

    if (!over) return;

    const taskId = active.id;

    // Find the task in all status arrays
    let task = null;
    let currentStatus = null;

    // Check pending tasks
    task = tasksByStatus.pending?.find((t) => t.id === taskId);
    if (task) currentStatus = 'pending';

    // Check in-progress tasks
    if (!task) {
      task = tasksByStatus.inProgress?.find((t) => t.id === taskId);
      if (task) currentStatus = 'in-progress';
    }

    // Check completed tasks
    if (!task) {
      task = tasksByStatus.completed?.find((t) => t.id === taskId);
      if (task) currentStatus = 'completed';
    }

    if (!task) return;

    // Determine new status based on where it was dropped
    let newStatus = currentStatus;

    // Check if dropped on a task (reordering within same column)
    const overTask = [...(tasksByStatus.pending || []), ...(tasksByStatus.inProgress || []), ...(tasksByStatus.completed || [])].find((t) => t.id === over.id);

    if (overTask) {
      // Dropped on another task - use that task's status
      newStatus = overTask.status;
    } else {
      // Dropped on column area - determine status from over.id or data-status
      const overElement = document.querySelector(`[data-sortable-id="${over.id}"]`);
      if (overElement) {
        const columnElement = overElement.closest('[data-column-status]');
        if (columnElement) {
          newStatus = columnElement.getAttribute('data-column-status');
        }
      }

      // Fallback: try to determine from over.id string
      if (over.id.toString().includes('pending')) {
        newStatus = 'pending';
      } else if (over.id.toString().includes('progress')) {
        newStatus = 'in-progress';
      } else if (over.id.toString().includes('completed')) {
        newStatus = 'completed';
      }
    }

    // Update task status if it changed
    if (newStatus && newStatus !== currentStatus) {
      dispatch(updateTask({ id: taskId, status: newStatus }));
    }
  };

  const handleCardClick = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleEditTask = (task) => {
    setSelectedTask(task);
    setShowTaskModal(true);
  };

  const handleDeleteTask = (task) => {
    setTaskToDelete(task);
    setShowDeleteModal(true);
  };

  const handleDeleteConfirm = () => {
    if (taskToDelete) {
      dispatch(deleteTask(taskToDelete.id));
      setShowDeleteModal(false);
      setTaskToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
    setTaskToDelete(null);
  };

  const handleAssignTask = (task) => {
    setTaskForAssignment(task);
    setShowAssignmentModal(true);
  };

  const handleAssignmentSave = (selectedUserIds) => {
    if (taskForAssignment) {
      dispatch(
        updateTask({
          id: taskForAssignment.id,
          assigneeIds: selectedUserIds,
        })
      );
    }
    setShowAssignmentModal(false);
    setTaskForAssignment(null);
  };

  const handleDuplicateTask = (task) => {
    const duplicatedTask = {
      ...task,
      id: Date.now(),
      title: `${task.title} (Copy)`,
      createdAt: new Date().toISOString(),
      status: 'pending',
    };
    dispatch(updateTask(duplicatedTask));
  };

  const handleMarkComplete = (taskId) => {
    dispatch(updateTask({ id: taskId, status: 'completed' }));
  };

  const handleMarkInProgress = (taskId) => {
    dispatch(updateTask({ id: taskId, status: 'in-progress' }));
  };

  const handleAddTaskToColumn = (status) => {
    onAddTask(status);
  };

  return (
    <>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}>
        <div className="grid grid-cols-3 gap-6 h-full">
          <div data-column-status="pending">
            <TaskColumn
              title="Pending"
              tasks={tasksByStatus.pending || []}
              status="pending"
              statusColor="bg-yellow-400"
              users={users}
              onAddTask={handleAddTaskToColumn}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAssignTask={handleAssignTask}
              onDuplicate={handleDuplicateTask}
              onMarkComplete={handleMarkComplete}
              onMarkInProgress={handleMarkInProgress}
              onCardClick={handleCardClick}
            />
          </div>

          <div data-column-status="in-progress">
            <TaskColumn
              title="In Progress"
              tasks={tasksByStatus.inProgress || []}
              status="in-progress"
              statusColor="bg-purple-500"
              users={users}
              onAddTask={handleAddTaskToColumn}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAssignTask={handleAssignTask}
              onDuplicate={handleDuplicateTask}
              onMarkComplete={handleMarkComplete}
              onMarkInProgress={handleMarkInProgress}
              onCardClick={handleCardClick}
            />
          </div>

          <div data-column-status="completed">
            <TaskColumn
              title="Completed"
              tasks={tasksByStatus.completed || []}
              status="completed"
              statusColor="bg-green-500"
              users={users}
              onAddTask={handleAddTaskToColumn}
              onEditTask={handleEditTask}
              onDeleteTask={handleDeleteTask}
              onAssignTask={handleAssignTask}
              onDuplicate={handleDuplicateTask}
              onMarkComplete={handleMarkComplete}
              onMarkInProgress={handleMarkInProgress}
              onCardClick={handleCardClick}
            />
          </div>
        </div>

        {/* Drag Overlay */}
        <DragOverlay>
          {activeTask ? (
            <TaskCard
              task={activeTask}
              users={users}
              onEdit={() => {}}
              onDelete={() => {}}
              onAssign={() => {}}
              onDuplicate={() => {}}
              onMarkComplete={() => {}}
              onMarkInProgress={() => {}}
              onCardClick={() => {}}
              isDragOverlay={true}
            />
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Task Detail Modal */}
      <TaskDetailModal
        isOpen={showTaskModal}
        onClose={() => {
          setShowTaskModal(false);
          setSelectedTask(null);
        }}
        task={selectedTask}
        users={users}
        onSave={() => {
          // Optional: Add any additional save logic here
        }}
      />

      {/* Delete Confirmation Modal */}
      <Modal
        title="Delete Task"
        open={showDeleteModal}
        onOk={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
        okText="Delete"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
        centered>
        <p>
          Are you sure you want to delete the task <strong>"{taskToDelete?.title}"</strong>?
        </p>
        <p className="text-gray-500 mt-2">This action cannot be undone.</p>
      </Modal>

      {/* User Assignment Modal */}
      <UserAssignmentModal
        isOpen={showAssignmentModal}
        onClose={() => {
          setShowAssignmentModal(false);
          setTaskForAssignment(null);
        }}
        users={users}
        selectedUserIds={taskForAssignment?.assigneeIds || []}
        onSave={handleAssignmentSave}
      />
    </>
  );
};

export default TaskBoard;
