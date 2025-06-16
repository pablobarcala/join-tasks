import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useListsStore } from '@/store/listsStore';
import EditListModal from './EditListModal';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import ShareListModal from './ShareListModal';

export default function ListCard({ list }) {
  const router = useRouter();
  const { user } = useAuthStore();
  const { updateList, deleteList, shareList } = useListsStore();
  
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);

  // Verificar si el usuario actual es el owner
  const isOwner = list.owner?._id === user?._id || list.owner === user?._id;

  const handleCardClick = () => {
    router.push(`/lists/${list._id}`);
  };

  const handleEditList = async (listData) => {
    try {
      await updateList(list._id, listData);
      setShowEditModal(false);
    } catch (error) {
      console.error('Error updating list:', error);
    }
  };

  const handleDeleteList = async () => {
    try {
      await deleteList(list._id);
    } catch (error) {
      console.error('Error deleting list:', error);
    }
  };

  const handleShareList = async (email) => {
    try {
      await shareList(list._id, email);
      setShowShareModal(false);
    } catch (error) {
      console.error('Error sharing list:', error);
      throw error;
    }
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      <div 
        className="bg-white rounded-lg shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-200 cursor-pointer relative group"
        onClick={handleCardClick}
      >
        {/* Dropdown menu */}
        <div className="absolute top-4 right-4" onClick={stopPropagation}>
          <button
            onClick={() => setShowDropdown(!showDropdown)}
            className="p-1 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
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
                        setShowEditModal(true);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                      Editar
                    </button>
                    <button
                      onClick={() => {
                        setShowShareModal(true);
                        setShowDropdown(false);
                      }}
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      <svg className="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                      </svg>
                      Compartir
                    </button>
                    <hr className="my-1" />
                    <button
                      onClick={() => {
                        setShowDeleteModal(true);
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

        {/* Contenido de la tarjeta */}
        <div className="pr-8">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {list.name}
          </h3>
          
          {list.description && (
            <p className="text-gray-600 mb-4 line-clamp-2">
              {list.description}
            </p>
          )}
          
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500">
              {/* Mostrar información del owner si no eres el owner */}
              {!isOwner && list.owner && (
                <span>Por {list.owner.name}</span>
              )}
            </div>
            
            {/* Indicador de lista compartida */}
            {list.sharedWith && list.sharedWith.length > 0 && (
              <div className="flex items-center text-sm text-gray-500">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                {list.sharedWith.length}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modales */}
      {showEditModal && (
        <EditListModal
          list={list}
          onSubmit={handleEditList}
          onClose={() => setShowEditModal(false)}
        />
      )}

      {/* <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteList}
        onClose={() => setShowDeleteModal(false)}
        title="Eliminar Lista"
        message={`¿Estás seguro de que quieres eliminar la lista "${list.name}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar Lista"
      /> */}

      {showShareModal && (
        <ShareListModal
          list={list}
          onSubmit={handleShareList}
          onClose={() => setShowShareModal(false)}
        />
      )}
    </>
  );
}