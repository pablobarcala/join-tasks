const Task = require('../models/Task');
// const dotenv = require('dotenv')
const axios = require('axios')

// dotenv.config()

const LIST_SERVICE_URL = "http://localhost:3003/api/lists"

async function hasAccessToList(listId, userId, token) {
  try {
    const response = await axios.get(`${LIST_SERVICE_URL}/${listId}/access/${userId}`, {
      headers: {
        Authorization: token
      }
    });
    return response.data.hasAccess;
  } catch (err) {
    console.log(err.message, err.response.data);
    return false;
  }
}

exports.getTasks = async (req, res) => {
  try {
    const { listId } = req.params;
    
    // Verificar que el usuario tenga acceso a la lista
    const hasAccess = await hasAccessToList(listId, req.userId, req.headers.authorization);
    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta lista' });
    }

    const tasks = await Task.find({ listId })
      .sort({ createdAt: -1 });
      // .populate('createdBy', 'name email')

    res.json(tasks);
  } catch (err) {
    console.error('Error al obtener tareas:', err);
    res.status(500).json({ message: 'Error al obtener tareas' });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { listId } = req.params;
    const { title, description, tags } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'El título es obligatorio' });
    }

    // Verificar acceso a la lista
    const hasAccess = await hasAccessToList(listId, req.userId, req.headers.authorization);
    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta lista' });
    }

    const task = new Task({
      title,
      description: description || '',
      listId,
      createdBy: req.userId,
      tags: tags || []
    });

    await task.save();
    // await task.populate('createdBy', 'name email');
    
    res.status(201).json(task);
  } catch (err) {
    console.error('Error al crear tarea:', err);
    res.status(500).json({ message: 'Error al crear tarea' });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, completed, tags } = req.body;
    
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar acceso a la lista
    const hasAccess = await hasAccessToList(task.listId, req.userId, req.headers.authorization);
    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    task.title = title !== undefined ? title : task.title;
    task.description = description !== undefined ? description : task.description;
    task.completed = completed !== undefined ? completed : task.completed;
    task.tags = tags !== undefined ? tags : task.tags;
    
    await task.save();
    // await task.populate('createdBy', 'name email');
    
    res.json(task);
  } catch (err) {
    console.error('Error al actualizar tarea:', err);
    res.status(500).json({ message: 'Error al actualizar tarea' });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    // Verificar acceso a la lista
    const hasAccess = await hasAccessToList(task.listId, req.userId, req.headers.authorization);
    if (!hasAccess) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Tarea eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar tarea:', err);
    res.status(500).json({ message: 'Error al eliminar tarea' });
  }
};