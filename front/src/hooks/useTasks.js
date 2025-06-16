import { useEffect } from 'react';
import { useTasksStore } from '../store/tasksStore';

export const useTasks = (listId) => {
  const { 
    tasksByList, 
    fetchTasks, 
    createTask: storeCreateTask, 
    toggleTask: storeToggleTask,
    updateTask,
    deleteTask,
    getListData,
    clearError 
  } = useTasksStore();

  const { tasks, loading, error } = getListData(listId);

  // Fetch tasks cuando cambia el listId
  useEffect(() => {
    if (listId) {
      fetchTasks(listId);
    }
  }, [listId, fetchTasks]);

  // Wrapper functions que incluyen el listId
  const createTask = async (taskData) => {
    return storeCreateTask(listId, taskData);
  };

  const toggleTask = async (taskId) => {
    return storeToggleTask(listId, taskId);
  };

  const updateTaskWrapper = async (taskId, taskData) => {
    return updateTask(listId, taskId, taskData);
  };

  const deleteTaskWrapper = async (taskId) => {
    return deleteTask(listId, taskId);
  };

  const clearErrorWrapper = () => {
    clearError(listId);
  };

  return {
    tasks,
    loading,
    error,
    createTask,
    toggleTask,
    updateTask: updateTaskWrapper,
    deleteTask: deleteTaskWrapper,
    clearError: clearErrorWrapper
  };
};