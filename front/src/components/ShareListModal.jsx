"use client"

import { useState } from 'react';

export default function ShareListModal({ list, onSubmit, onClose }) {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    setError('');
    
    try {
      await onSubmit(email.trim());
      setEmail('');
    } catch (error) {
      setError(error.message || 'Error al compartir la lista');
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg w-full max-w-md">
        <div className="p-6">
          <h2 className="text-xl font-semibold mb-4">Compartir Lista</h2>
          
          <div className="mb-4">
            <p className="text-gray-600 text-sm">
              Compartiendo: <span className="font-medium">{list?.name}</span>
            </p>
          </div>

          {/* Usuarios ya compartidos */}
          {list?.sharedWith && list.sharedWith.length > 0 && (
            <div className="mb-4">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Compartido con:</h4>
              <div className="space-y-1">
                {list.sharedWith.map((user) => (
                  <div key={user._id} className="flex items-center text-sm text-gray-600">
                    <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center mr-2">
                      <span className="text-xs font-medium">
                        {user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span>{user.name} ({user.email})</span>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email del usuario
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="usuario@ejemplo.com"
                required
                autoFocus
              />
              {error && (
                <p className="text-red-600 text-sm mt-1">{error}</p>
              )}
            </div>
            
            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                disabled={isLoading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
                disabled={isLoading || !email.trim()}
              >
                {isLoading ? 'Compartiendo...' : 'Compartir'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}