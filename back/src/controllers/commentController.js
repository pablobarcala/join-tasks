const Comment = require('../models/Comment');
const Task = require('../models/Task');
const List = require('../models/List');

exports.getComments = async (req, res) => {
  try {
    const { taskId } = req.params;
    
    // Verificar acceso a la tarea
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const list = await List.findById(task.listId);
    if (!list.hasAccess(req.userId)) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    const comments = await Comment.find({ taskId })
      .populate('author', 'name email')
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    console.error('Error al obtener comentarios:', err);
    res.status(500).json({ message: 'Error al obtener comentarios' });
  }
};

exports.createComment = async (req, res) => {
  try {
    const { taskId } = req.params;
    const { content } = req.body;
    
    if (!content) {
      return res.status(400).json({ message: 'El contenido es obligatorio' });
    }

    // Verificar acceso a la tarea
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Tarea no encontrada' });
    }

    const list = await List.findById(task.listId);
    if (!list.hasAccess(req.userId)) {
      return res.status(403).json({ message: 'No tienes acceso a esta tarea' });
    }

    const comment = new Comment({
      content,
      taskId,
      author: req.userId
    });

    await comment.save();
    await comment.populate('author', 'name email');
    
    res.status(201).json(comment);
  } catch (err) {
    console.error('Error al crear comentario:', err);
    res.status(500).json({ message: 'Error al crear comentario' });
  }
};

exports.deleteComment = async (req, res) => {
  try {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      return res.status(404).json({ message: 'Comentario no encontrado' });
    }

    // Solo el autor puede eliminar su comentario
    if (comment.author.toString() !== req.userId) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar este comentario' });
    }

    await Comment.findByIdAndDelete(req.params.id);
    res.json({ message: 'Comentario eliminado correctamente' });
  } catch (err) {
    console.error('Error al eliminar comentario:', err);
    res.status(500).json({ message: 'Error al eliminar comentario' });
  }
};