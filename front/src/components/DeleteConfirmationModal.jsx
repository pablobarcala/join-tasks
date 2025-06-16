"use client"

import { useState } from 'react';

export default function DeleteConfirmationModal({ 
  isOpen, 
  onConfirm, 
  onClose, 
  title = "Confirmar eliminación",
  message = "¿Estás seguro de que quieres eliminar este elemento?",
  confirmText = "Eliminar",
  cancelText = "Cancelar",
  type = "danger" // danger, warning
}) {
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleConfirm = async () => {
    setIsLoading(true);
    try {
      await onConfirm();
      onClose();
    } catch (error) {
      console.error('Error in confirmation:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const confirmButtonClass = type === 'danger' 
    ? 'bg-red-600 hover:bg-red-700 text-white' 
    : 'bg-orange-600 hover:bg-orange-700 text-white';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mr-3 ${
              type === 'danger' ? 'bg-red-100' : 'bg-orange-100'
            }`}>
              <svg 
                className={`w-6 h-6 ${type === 'danger' ? 'text-red-600' : 'text-orange-600'}`} 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" 
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
          </div>
          
          <p className="text-gray-600 mb-6">{message}</p>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
              disabled={isLoading}
            >
              {cancelText}
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className={`flex-1 px-4 py-2 rounded-md transition-colors disabled:opacity-50 ${confirmButtonClass}`}
              disabled={isLoading}
            >
              {isLoading ? 'Eliminando...' : confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}