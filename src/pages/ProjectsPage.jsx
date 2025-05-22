import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { selectCurrentProject } from '../store/projectsSlice';
import ProjectList from '../components/projects/ProjectList';
import UsersList from '../components/projects/UsersList';
import ProjectPage from './ProjectPage';

const ProjectsPage = () => {
  const [showProjectList, setShowProjectList] = useState(true);
  const currentProject = useSelector(selectCurrentProject);

  return (
    <div className="min-h-screen bg-gray-50 py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {showProjectList ? (
          <div className="mb-6">
            <ProjectList />

            <div className="mt-6">
              <UsersList />
            </div>

            {currentProject && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={() => setShowProjectList(false)}
                  className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white font-medium rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Manage Tasks
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <button
                onClick={() => setShowProjectList(true)}
                className="inline-flex items-center px-4 py-2 mb-4 text-indigo-600 font-medium rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                Back to Projects
              </button>
            </div>

            <ProjectPage />
          </>
        )}
      </div>
    </div>
  );
};

export default ProjectsPage;
