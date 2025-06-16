"use client"

import { useParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { useListsStore } from '@/store/listsStore';
import ProtectedRoute from '@/components/ProtectedRoute';
import Layout from '@/components/Layout';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';
import { useTasks } from '@/hooks/useTasks';

export default function ListDetail() {
  const params = useParams();
  const router = useRouter();
  const { lists } = useListsStore();
  const { tasks, loading, createTask, toggleTask } = useTasks(params.id);
  const [showCreateModal, setShowCreateModal] = useState(false);

  const currentList = lists.find(list => list._id === params.id);

  const handleCreateTask = async (taskData) => {
    try {
      await createTask(taskData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating task:', error);
    }
  };

  if (!currentList && !loading) {
    return (
      <ProtectedRoute>
        <Layout>
          <div className="text-center py-12">
            <p>Lista no encontrada</p>
          </div>
        </Layout>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-4xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <button
                onClick={() => router.back()}
                className="text-blue-600 hover:text-blue-800 mb-2"
              >
                ← Volver
              </button>
              <h1 className="text-3xl font-bold text-gray-900">
                {currentList?.name}
              </h1>
              {currentList?.description && (
                <p className="text-gray-600 mt-1">{currentList.description}</p>
              )}
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nueva Tarea
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando tareas...</div>
          ) : (
            <div className="space-y-4">
              {tasks.map(task => (
                <TaskCard 
                  key={task._id} 
                  task={task} 
                  onToggle={() => toggleTask(task._id)}
                />
              ))}
              {tasks.length === 0 && (
                <div className="text-center py-12 text-gray-500">
                  <p>No hay tareas en esta lista. ¡Crea la primera!</p>
                </div>
              )}
            </div>
          )}

          {showCreateModal && (
            <CreateTaskModal
              onSubmit={handleCreateTask}
              onClose={() => setShowCreateModal(false)}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}