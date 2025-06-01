// src/controllers/taskController.js
const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, listId } = req.body;
    const owner = req.userId;

    if (!title || !listId) {
      return res.status(400).json({ message: "Título y lista requeridos" });
    }

    const task = new Task({ title, description, dueDate, listId, owner });
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: "Error al crear la tarea" });
  }
};

exports.getTasksByList = async (req, res) => {
  try {
    const { listId } = req.params;
    const owner = req.userId;

    const tasks = await Task.find({ listId, owner });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener tareas" });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const task = await Task.findByIdAndUpdate(id, updates, { new: true });

    if (!task) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json(task);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar la tarea" });
  }
};

exports.deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Task.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Tarea no encontrada" });

    res.json({ message: "Tarea eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar la tarea" });
  }
};
