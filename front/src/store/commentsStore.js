import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

export const useCommentsStore = create()(
  devtools(
    (set, get) => ({
      commentsByTask: {}, // { taskId: { comments: [], loading: false, error: null } }

      // Obtener comentarios por tarea
      fetchComments: async (taskId) => {
        if (!taskId) return;

        set((state) => ({
          commentsByTask: {
            ...state.commentsByTask,
            [taskId]: {
              ...state.commentsByTask[taskId],
              loading: true,
              error: null
            }
          }
        }));

        try {
          const data = await api.getComments(taskId);
          set((state) => ({
            commentsByTask: {
              ...state.commentsByTask,
              [taskId]: {
                comments: data,
                loading: false,
                error: null
              }
            }
          }));
        } catch (error) {
          set((state) => ({
            commentsByTask: {
              ...state.commentsByTask,
              [taskId]: {
                comments: state.commentsByTask[taskId]?.comments || [],
                loading: false,
                error: error.message
              }
            }
          }));
          console.error('Error fetching comments:', error);
        }
      },

      // Crear comentario
      createComment: async (taskId, content) => {
        try {
          const newComment = await api.createComment(taskId, content);
          set((state) => ({
            commentsByTask: {
              ...state.commentsByTask,
              [taskId]: {
                ...state.commentsByTask[taskId],
                comments: [...(state.commentsByTask[taskId]?.comments || []), newComment],
                error: null
              }
            }
          }));
          return newComment;
        } catch (error) {
          set((state) => ({
            commentsByTask: {
              ...state.commentsByTask,
              [taskId]: {
                ...state.commentsByTask[taskId],
                error: error.message
              }
            }
          }));
          throw error;
        }
      },

      // Eliminar comentario
      deleteComment: async (taskId, commentId) => {
        try {
          await api.deleteComment(commentId);
          set((state) => ({
            commentsByTask: {
              ...state.commentsByTask,
              [taskId]: {
                ...state.commentsByTask[taskId],
                comments: state.commentsByTask[taskId]?.comments.filter(comment => comment._id !== commentId) || [],
                error: null
              }
            }
          }));
        } catch (error) {
          set((state) => ({
            commentsByTask: {
              ...state.commentsByTask,
              [taskId]: {
                ...state.commentsByTask[taskId],
                error: error.message
              }
            }
          }));
          throw error;
        }
      },

      // Obtener datos de una tarea específica
      getTaskComments: (taskId) => {
        return get().commentsByTask[taskId] || { comments: [], loading: false, error: null };
      },

      // Limpiar errores
      clearError: (taskId) => {
        set((state) => ({
          commentsByTask: {
            ...state.commentsByTask,
            [taskId]: {
              ...state.commentsByTask[taskId],
              error: null
            }
          }
        }));
      },
    }),
    {
      name: 'comments-store',
    }
  )
);