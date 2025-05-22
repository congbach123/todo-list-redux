import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProjects, selectCurrentProjectId, setCurrentProject, addProject, updateProject, deleteProject } from '../../store/projectsSlice';

const ProjectList = () => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const currentProjectId = useSelector(selectCurrentProjectId);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleCreateSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    dispatch(
      addProject({
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
    );

    // Reset form
    setFormData({
      name: '',
      description: '',
    });

    // Close modal
    setIsCreateModalOpen(false);
  };

  const handleEditSubmit = (e) => {
    e.preventDefault();

    if (!formData.name.trim()) return;

    dispatch(
      updateProject({
        id: editingProject.id,
        name: formData.name.trim(),
        description: formData.description.trim(),
      })
    );

    // Reset form
    setFormData({
      name: '',
      description: '',
    });

    // Close modal
    setIsEditModalOpen(false);
    setEditingProject(null);
  };

  const handleEdit = (project) => {
    setEditingProject(project);
    setFormData({
      name: project.name,
      description: project.description || '',
    });
    setIsEditModalOpen(true);
  };

  const handleDelete = (projectId) => {
    if (window.confirm('Are you sure you want to delete this project? All tasks in this project will also be deleted.')) {
      dispatch(deleteProject(projectId));
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Projects</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor">
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            New Project
          </button>
        </div>

        <div className="space-y-4">
          {projects.map((project) => (
            <div
              key={project.id}
              className={`border rounded-lg p-4 transition-colors ${project.id === currentProjectId ? 'border-indigo-300 bg-indigo-50' : 'border-gray-200 hover:border-indigo-200 hover:bg-indigo-50'}`}>
              <div className="flex items-start justify-between">
                <div
                  className="flex-1 cursor-pointer"
                  onClick={() => dispatch(setCurrentProject(project.id))}>
                  <h3 className="text-lg font-medium text-gray-900">{project.name}</h3>
                  {project.description && <p className="mt-1 text-sm text-gray-500">{project.description}</p>}
                </div>
                <div className="flex space-x-2 ml-4">
                  <button
                    onClick={() => handleEdit(project)}
                    className="p-1 text-gray-500 hover:text-indigo-600 focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                  <button
                    onClick={() => handleDelete(project.id)}
                    className="p-1 text-gray-500 hover:text-red-600 focus:outline-none">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {projects.length === 0 && (
            <div className="text-center py-12">
              <svg
                className="mx-auto h-12 w-12 text-gray-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              <p className="mt-2 text-sm font-medium text-gray-500">No projects available</p>
              <p className="mt-1 text-sm text-gray-500">Create a new project to get started</p>
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Create New Project</h2>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreateSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Create Project
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Project Modal */}
      {isEditModalOpen && editingProject && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg max-w-md w-full mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Edit Project</h2>
              <button
                onClick={() => {
                  setIsEditModalOpen(false);
                  setEditingProject(null);
                }}
                className="text-gray-500 hover:text-gray-700 focus:outline-none">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <form onSubmit={handleEditSubmit}>
              <div className="mb-4">
                <label
                  htmlFor="edit-name"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Project Name *
                </label>
                <input
                  type="text"
                  id="edit-name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="mb-6">
                <label
                  htmlFor="edit-description"
                  className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  rows="3"
                  className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setEditingProject(null);
                  }}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectList;
