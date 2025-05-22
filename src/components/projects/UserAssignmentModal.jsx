import React, { useState, useEffect, useMemo } from 'react';

const UserAssignmentModal = ({ isOpen, onClose, users, selectedUserIds, onSave }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [localSelectedUserIds, setLocalSelectedUserIds] = useState(selectedUserIds || []);

  // Reset local state when modal opens
  useEffect(() => {
    if (isOpen) {
      setLocalSelectedUserIds(selectedUserIds || []);
      setSearchTerm('');
    }
  }, [isOpen, selectedUserIds]);

  // Filter users based on search term
  const filteredUsers = useMemo(() => {
    if (!searchTerm.trim()) return users;

    const search = searchTerm.toLowerCase();
    return users.filter((user) => user.name.toLowerCase().includes(search) || user.email.toLowerCase().includes(search));
  }, [users, searchTerm]);

  // Handle user selection
  const handleUserToggle = (userId) => {
    setLocalSelectedUserIds((prev) => {
      if (prev.includes(userId)) {
        return prev.filter((id) => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  // Handle select all filtered -> users
  const handleSelectAllFiltered = () => {
    const filteredUserIds = filteredUsers.map((user) => user.id);
    const allFilteredSelected = filteredUserIds.every((id) => localSelectedUserIds.includes(id));

    if (allFilteredSelected) {
      // Remove all filtered users from selection
      setLocalSelectedUserIds((prev) => prev.filter((id) => !filteredUserIds.includes(id)));
    } else {
      // Add all filtered users to selection
      const newSelectedIds = [...new Set([...localSelectedUserIds, ...filteredUserIds])];
      setLocalSelectedUserIds(newSelectedIds);
    }
  };

  const handleClearAll = () => {
    setLocalSelectedUserIds([]);
  };

  const handleSave = () => {
    onSave(localSelectedUserIds);
    onClose();
  };

  const getUserById = (userId) => users.find((user) => user.id === userId);

  if (!isOpen) return null;

  const selectedUsers = localSelectedUserIds.map(getUserById).filter(Boolean);
  const filteredUserIds = filteredUsers.map((user) => user.id);
  const allFilteredSelected = filteredUserIds.length > 0 && filteredUserIds.every((id) => localSelectedUserIds.includes(id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-4/5 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Assign Users to Task</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 focus:outline-none">
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Search and controls */}
        <div className="p-6 border-b border-gray-200">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg
                className="h-5 w-5 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex space-x-2">
              {filteredUsers.length > 0 && (
                <button
                  onClick={handleSelectAllFiltered}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium">
                  {allFilteredSelected ? 'Deselect All Visible' : 'Select All Visible'}
                </button>
              )}
              {localSelectedUserIds.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-sm text-red-600 hover:text-red-800 font-medium">
                  Clear All
                </button>
              )}
            </div>
            <div className="text-sm text-gray-500">{localSelectedUserIds.length} selected</div>
          </div>
        </div>

        {/* Selected users preview */}
        {selectedUsers.length > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-gray-200">
            <div className="text-sm font-medium text-gray-700 mb-2">Selected Users:</div>
            <div className="flex flex-wrap gap-2">
              {selectedUsers.map((user) => (
                <div
                  key={user.id}
                  className="flex items-center bg-blue-100 rounded-full px-3 py-1">
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="h-5 w-5 rounded-full mr-2"
                  />
                  <span className="text-sm text-blue-800">{user.name}</span>
                  <button
                    onClick={() => handleUserToggle(user.id)}
                    className="ml-2 text-blue-600 hover:text-blue-800">
                    <svg
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* User list */}
        <div className="flex-1 overflow-y-auto p-6">
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8">
              <svg
                className="mx-auto h-12 w-12 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z"
                />
              </svg>
              <p className="mt-2 text-sm text-gray-500">{searchTerm ? 'No users found matching your search.' : 'No users available.'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredUsers.map((user) => {
                const isSelected = localSelectedUserIds.includes(user.id);
                return (
                  <div
                    key={user.id}
                    className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${isSelected ? 'bg-indigo-50 border-indigo-200' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                    onClick={() => handleUserToggle(user.id)}>
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleUserToggle(user.id)}
                      className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    />

                    <div className="ml-3 flex items-center flex-1">
                      <img
                        src={user.avatar}
                        alt={user.name}
                        className="h-10 w-10 rounded-full"
                      />
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            {localSelectedUserIds.length} of {users.length} users selected
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Save Assignment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserAssignmentModal;
