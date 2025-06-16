"use client"

import { useModal } from '@/hooks/useModal';
import { useAuthStore } from '@/store/authStore';
import { useTasksStore } from '@/store/tasksStore';
import { useState } from 'react';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import EditTaskModal from './EditTaskModal';

export default function TaskCard({ listId, task, onToggle }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { user } = useAuthStore();
  const { updateTask, deleteTask } = useTasksStore()

  const editModal = useModal(false)
  const deleteModal = useModal(false)

  const isOwner = task.createdBy === user._id

  const handleEditTask = async (taskData) => {
    try {
      await updateTask(listId, task._id, taskData);
      editModal.close();
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const handleDeleteTask = async () => {
    try {
      await deleteTask(listId, task._id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div
        className={`relative
          bg-white rounded-lg border transition-all duration-200 hover:shadow-md
          ${task.completed ? 'opacity-75 bg-gray-50' : 'shadow-sm'}
          ${isHovered ? 'border-blue-300' : 'border-gray-200'}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="p-4">
          <div className="flex items-start space-x-3">
            <div className='absolute top-4 right-4' onClick={stopPropagation}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className={`p-1 rounded-full hover:bg-gray-100 opacity-0 
                  ${isHovered ? 'opacity-100 transition-opacity' : ''}
                `}
              >
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01" />
                </svg>
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 z-10">
                  <div className="py-1">
                    {isOwner && (
                      <>
                        <button
                          onClick={() => {
                            editModal.open();
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                          Editar
                        </button>
                        <hr className="my-1" />
                        <button
                          onClick={() => {
                            deleteModal.open();
                            setShowDropdown(false);
                          }}
                          className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                        >
                          <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                          Eliminar
                        </button>
                      </>
                    )}
                    {!isOwner && (
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Lista compartida
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            {/* Checkbox */}
            <button
              onClick={onToggle}
              className={`
                mt-1 w-5 h-5 rounded border-2 flex items-center justify-center transition-colors
                ${task.completed 
                  ? 'bg-blue-600 border-blue-600 text-white' 
                  : 'border-gray-300 hover:border-blue-500'
                }
              `}
            >
              {task.completed && (
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              )}
            </button>

            {/* Contenido principal */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className={`
                    text-lg font-medium text-gray-900
                    ${task.completed ? 'line-through text-gray-500' : ''}
                  `}>
                    {task.title}
                  </h3>
                  
                  {task.description && (
                    <p className={`
                      mt-1 text-sm text-gray-600
                      ${task.completed ? 'line-through text-gray-400' : ''}
                    `}>
                      {task.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Tags */}
              {task.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {task.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
        
      </div>

      {/* Modales */}
      {editModal.isOpen && (
        <EditTaskModal 
          task={task}
          onSubmit={handleEditTask}
          onClose={() => editModal.close()}
        />
      )}

      <DeleteConfirmationModal
        isOpen={deleteModal.isOpen}
        onConfirm={handleDeleteTask}
        onClose={() => deleteModal.close()}
        title="Eliminar Tarea"
        message={`¿Estás seguro de que quieres eliminar la tarea "${task.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Tarea"
      />
    </>
  );
}