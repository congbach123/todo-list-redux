import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { selectProjects, setCurrentProject } from '../../store/projectsSlice';

const ProjectHeader = ({ project, activeView, onViewChange }) => {
  const dispatch = useDispatch();
  const projects = useSelector(selectProjects);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const handleProjectChange = (projectId) => {
    dispatch(setCurrentProject(projectId));
    setIsOpen(false);
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-md">
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-4">
              {/* Custom dropdown */}
              <div
                className="relative"
                ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 text-2xl font-bold text-gray-800 hover:text-indigo-600 transition-colors duration-200 group focus:outline-none">
                  <span>{project.name}</span>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-gray-500 group-hover:text-indigo-500 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Dropdown menu */}
                {isOpen && (
                  <div className="absolute z-10 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 py-1 transform origin-top transition-all duration-200 ease-in-out z-30">
                    <div className="py-1 max-h-60 overflow-auto">
                      {projects.map((p) => (
                        <button
                          key={p.id}
                          onClick={() => handleProjectChange(p.id)}
                          className={`w-full text-left px-4 py-2.5 text-sm leading-5 
                                      ${p.id === project.id ? 'bg-indigo-50 text-indigo-700 font-medium' : 'text-gray-700'} 
                                      hover:bg-gray-50 focus:outline-none focus:bg-gray-50 transition duration-150 ease-in-out
                                      flex items-center justify-between`}>
                          <span>{p.name}</span>
                          {p.id === project.id && (
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-4 w-4 text-indigo-600"
                              viewBox="0 0 20 20"
                              fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <span className="bg-indigo-100 text-indigo-800 text-xs font-medium px-2.5 py-0.5 rounded">{project.tasks} Tasks</span>
            </div>
            {project.description && <p className="mt-1 text-sm text-gray-500">{project.description}</p>}
          </div>

          <div className="flex space-x-2">
            <button
              onClick={() => onViewChange('list')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${activeView === 'list' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                List
              </div>
            </button>

            <button
              onClick={() => onViewChange('board')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${activeView === 'board' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                </svg>
                Board
              </div>
            </button>

            <button
              onClick={() => onViewChange('calendar')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md focus:outline-none ${activeView === 'calendar' ? 'bg-indigo-100 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'}`}>
              <div className="flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-1"
                  viewBox="0 0 20 20"
                  fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                    clipRule="evenodd"
                  />
                </svg>
                Calendar
              </div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHeader;
