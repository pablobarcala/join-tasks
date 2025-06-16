"use client"

import { useState } from 'react';

export default function TaskCard({ task, onToggle }) {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = date.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays < 0) {
      return { text: `Vencida hace ${Math.abs(diffDays)} día${Math.abs(diffDays) !== 1 ? 's' : ''}`, isOverdue: true };
    } else if (diffDays === 0) {
      return { text: 'Vence hoy', isToday: true };
    } else if (diffDays === 1) {
      return { text: 'Vence mañana', isTomorrow: true };
    } else if (diffDays <= 7) {
      return { text: `Vence en ${diffDays} días`, isThisWeek: true };
    } else {
      return { text: date.toLocaleDateString('es-ES'), isNormal: true };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'alta':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'media':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'baja':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case 'alta':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      case 'media':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
          </svg>
        );
      case 'baja':
        return (
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
        );
      default:
        return null;
    }
  };

  const dueDateInfo = task.dueDate ? formatDate(task.dueDate) : null;

  return (
    <div
      className={`
        bg-white rounded-lg border transition-all duration-200 hover:shadow-md
        ${task.completed ? 'opacity-75 bg-gray-50' : 'shadow-sm'}
        ${isHovered ? 'border-blue-300' : 'border-gray-200'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="p-4">
        <div className="flex items-start space-x-3">
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

              {/* Prioridad */}
              {task.priority && task.priority !== 'ninguna' && (
                <div className={`
                  ml-3 px-2 py-1 rounded-full text-xs font-medium border flex items-center space-x-1
                  ${getPriorityColor(task.priority)}
                `}>
                  {getPriorityIcon(task.priority)}
                  <span className="capitalize">{task.priority}</span>
                </div>
              )}
            </div>

            {/* Fecha de vencimiento */}
            {dueDateInfo && (
              <div className="mt-3">
                <span className={`
                  inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                  ${dueDateInfo.isOverdue ? 'bg-red-100 text-red-800' : ''}
                  ${dueDateInfo.isToday ? 'bg-orange-100 text-orange-800' : ''}
                  ${dueDateInfo.isTomorrow ? 'bg-yellow-100 text-yellow-800' : ''}
                  ${dueDateInfo.isThisWeek ? 'bg-blue-100 text-blue-800' : ''}
                  ${dueDateInfo.isNormal ? 'bg-gray-100 text-gray-800' : ''}
                `}>
                  <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                  {dueDateInfo.text}
                </span>
              </div>
            )}

            {/* Asignado a */}
            {task.assignedTo && (
              <div className="mt-2 flex items-center space-x-2">
                <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-white">
                    {task.assignedTo.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-600">
                  Asignado a {task.assignedTo.name}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}