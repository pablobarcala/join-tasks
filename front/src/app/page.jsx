"use client"

import { useAuthStore } from '@/store/authStore';
import { useListsStore } from '@/store/listsStore';
import ProtectedRoute from '../components/ProtectedRoute';
import Layout from '../components/Layout';
import ListCard from '../components/ListCard';
import CreateListModal from '../components/CreateListModal';
import { useEffect, useState } from 'react';

export default function Home() {
  const { user } = useAuthStore();
  const { lists, loading, createList, fetchLists } = useListsStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    fetchLists()
  }, [fetchLists])

  const handleCreateList = async (listData) => {
    try {
      await createList(listData);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating list:', error);
    }
  };

  return (
    <ProtectedRoute>
      <Layout>
        <div className="max-w-6xl mx-auto p-6">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Hola, {user?.name}
              </h1>
              <p className="text-gray-600 mt-1">
                Tienes {lists.length} lista{lists.length !== 1 ? 's' : ''}
              </p>
            </div>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Nueva Lista
            </button>
          </div>

          {loading ? (
            <div className="text-center py-8">Cargando listas...</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {lists.map(list => (
                <ListCard key={list._id} list={list} />
              ))}
              {lists.length === 0 && (
                <div className="col-span-full text-center py-12 text-gray-500">
                  <p>No tienes listas aún. ¡Crea tu primera lista!</p>
                </div>
              )}
            </div>
          )}

          {showCreateModal && (
            <CreateListModal
              onSubmit={handleCreateList}
              onClose={() => setShowCreateModal(false)}
            />
          )}
        </div>
      </Layout>
    </ProtectedRoute>
  );
}