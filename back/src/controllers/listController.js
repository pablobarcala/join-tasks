// src/controllers/listController.js
const List = require('../models/List');
const Task = require('../models/Task')

exports.createList = async (req, res) => {
  try {
    const { name } = req.body;
    const owner = req.userId; // suponiendo que pasaste el userId desde un middleware

    if (!name) return res.status(400).json({ message: "Nombre requerido" });

    const list = new List({ name, owner });
    await list.save();

    res.status(201).json(list);
  } catch (err) {
    res.status(500).json({ message: "Error al crear la lista" });
  }
};

exports.getLists = async (req, res) => {
  try {
    const owner = req.userId;
    const lists = await List.find({ owner: owner})
    const listsWithCounts = await Promise.all(
      lists.map(async (list) => {
        const totalTasks = await Task.countDocuments({ listId: list._id });
        const completedTasks = await Task.countDocuments({ listId: list._id, completed: true });

        return {
          ...list.toObject(),
          totalTasks,
          completedTasks
        };
      })
    );
    res.json(listsWithCounts);
  } catch (err) {
    console.error("Error al obtener listas: ", err)
    res.status(500).json({ message: "Error al obtener listas" });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

    const list = await List.findByIdAndUpdate(id, { name }, { new: true });

    if (!list) return res.status(404).json({ message: "Lista no encontrada" });

    res.json(list);
  } catch (err) {
    res.status(500).json({ message: "Error al actualizar la lista" });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await List.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Lista no encontrada" });

    res.json({ message: "Lista eliminada" });
  } catch (err) {
    res.status(500).json({ message: "Error al eliminar la lista" });
  }
};
