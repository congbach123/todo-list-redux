import React, { useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectAllProjects } from '../store/projectsSlice';
import TaskBoard from '../components/tasks/TaskBoard';

const ProjectBoard = () => {
  const { projectId } = useParams();
  const projects = useSelector(selectAllProjects);
  const project = projects.find((p) => p.id === projectId);

  // If project doesn't exist, redirect to projects page
  if (!project) {
    return <Navigate to="/projects" />;
  }

  return (
    <div>
      <TaskBoard />
    </div>
  );
};

export default ProjectBoard;
