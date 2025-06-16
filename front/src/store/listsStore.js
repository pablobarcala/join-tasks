import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

export const useListsStore = create()(
  devtools(
    (set, get) => ({
      lists: [],
      loading: false,
      error: null,

      // Obtener listas
      fetchLists: async () => {
        set({ loading: true, error: null });
        try {
          const data = await api.getLists();
          set({ lists: data, loading: false });
        } catch (error) {
          set({ error: error.message, loading: false });
          console.error('Error fetching lists:', error);
        }
      },

      // Crear lista
      createList: async (listData) => {
        try {
          set({ error: null });
          const newList = await api.createList(listData);
          set((state) => ({
            lists: [newList, ...state.lists]
          }));
          return newList;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Actualizar lista
      updateList: async (id, listData) => {
        try {
          set({ error: null });
          const updatedList = await api.updateList(id, listData);
          set((state) => ({
            lists: state.lists.map(list => 
              list._id === id ? updatedList : list
            )
          }));
          return updatedList;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Eliminar lista
      deleteList: async (id) => {
        try {
          set({ error: null });
          await api.deleteList(id);
          set((state) => ({
            lists: state.lists.filter(list => list._id !== id)
          }));
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Compartir lista
      shareList: async (id, email) => {
        try {
          set({ error: null });
          const updatedList = await api.shareList(id, email);
          set((state) => ({
            lists: state.lists.map(list => 
              list._id === id ? updatedList : list
            )
          }));
          return updatedList;
        } catch (error) {
          set({ error: error.message });
          throw error;
        }
      },

      // Limpiar errores
      clearError: () => set({ error: null }),
    }),
    {
      name: 'lists-store',
    }
  )
);