import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import api from '../services/api';

export const useTasksStore = create()(
  devtools(
    (set, get) => ({
      tasksByList: {}, // { listId: { tasks: [], loading: false, error: null } }

      // Obtener tareas por lista
      fetchTasks: async (listId) => {
        if (!listId) return;

        set((state) => ({
          tasksByList: {
            ...state.tasksByList,
            [listId]: {
              ...state.tasksByList[listId],
              loading: true,
              error: null
            }
          }
        }));

        try {
          const data = await api.getTasks(listId);
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                tasks: data,
                loading: false,
                error: null
              }
            }
          }));
        } catch (error) {
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                tasks: state.tasksByList[listId]?.tasks || [],
                loading: false,
                error: error.message
              }
            }
          }));
          console.error('Error fetching tasks:', error);
        }
      },

      // Crear tarea
      createTask: async (listId, taskData) => {
        try {
          const newTask = await api.createTask(listId, taskData);
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                ...state.tasksByList[listId],
                tasks: [newTask, ...(state.tasksByList[listId]?.tasks || [])],
                error: null
              }
            }
          }));
          return newTask;
        } catch (error) {
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                ...state.tasksByList[listId],
                error: error.message
              }
            }
          }));
          throw error;
        }
      },

      // Actualizar tarea
      updateTask: async (listId, taskId, taskData) => {
        try {
          const updatedTask = await api.updateTask(taskId, taskData);
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                ...state.tasksByList[listId],
                tasks: state.tasksByList[listId]?.tasks.map(task => 
                  task._id === taskId ? updatedTask : task
                ) || [],
                error: null
              }
            }
          }));
          return updatedTask;
        } catch (error) {
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                ...state.tasksByList[listId],
                error: error.message
              }
            }
          }));
          throw error;
        }
      },

      // Eliminar tarea
      deleteTask: async (listId, taskId) => {
        try {
          await api.deleteTask(taskId);
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                ...state.tasksByList[listId],
                tasks: state.tasksByList[listId]?.tasks.filter(task => task._id !== taskId) || [],
                error: null
              }
            }
          }));
        } catch (error) {
          set((state) => ({
            tasksByList: {
              ...state.tasksByList,
              [listId]: {
                ...state.tasksByList[listId],
                error: error.message
              }
            }
          }));
          throw error;
        }
      },

      // Toggle tarea completada
      toggleTask: async (listId, taskId) => {
        const tasks = get().tasksByList[listId]?.tasks || [];
        const task = tasks.find(t => t._id === taskId);
        if (task) {
          return get().updateTask(listId, taskId, { completed: !task.completed });
        }
      },

      // Obtener datos de una lista específica
      getListData: (listId) => {
        return get().tasksByList[listId] || { tasks: [], loading: false, error: null };
      },

      // Limpiar errores
      clearError: (listId) => {
        set((state) => ({
          tasksByList: {
            ...state.tasksByList,
            [listId]: {
              ...state.tasksByList[listId],
              error: null
            }
          }
        }));
      },
    }),
    {
      name: 'tasks-store',
    }
  )
);