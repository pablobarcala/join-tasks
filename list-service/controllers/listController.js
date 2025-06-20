const axios = require('axios');
const List = require('../models/List');
const dotenv = require('dotenv')

dotenv.config();

exports.getLists = async (req, res) => {
  try {
    // Obtener listas donde el usuario es owner o está en sharedWith
    const lists = await List.find({
      $or: [
        { owner: req.userId },
        { sharedWith: req.userId }
      ]
    })
    .sort({ createdAt: -1 });
    // .populate('owner', 'name email')
    // .populate('sharedWith', 'name email')

    res.json(lists);
  } catch (err) {
    console.error('Error al obtener listas:', err);
    res.status(500).json({ message: 'Error al obtener listas' });
  }
};

exports.createList = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    if (!name) {
      return res.status(400).json({ message: 'El nombre es obligatorio' });
    }

    const list = new List({
      name,
      description: description || '',
      owner: req.userId
    });

    await list.save();
    // await list.populate('owner', 'name email');
    
    res.status(201).json(list);
  } catch (err) {
    console.error('Error al crear lista:', err);
    res.status(500).json({ message: 'Error al crear lista' });
  }
};

exports.updateList = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    // Solo el owner puede editar
    if (list.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'No tienes permisos para editar esta lista' });
    }

    list.name = name || list.name;
    list.description = description !== undefined ? description : list.description;
    
    await list.save();
    // await list.populate('owner', 'name email');
    // await list.populate('sharedWith', 'name email');
    
    res.json(list);
  } catch (err) {
    console.error('Error al actualizar lista:', err);
    res.status(500).json({ message: 'Error al actualizar lista' });
  }
};

exports.deleteList = async (req, res) => {
  try {
    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    // Solo el owner puede eliminar
    if (list.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'No tienes permisos para eliminar esta lista' });
    }

    await List.findByIdAndDelete(req.params.id);
    res.json({ message: 'Lista eliminada correctamente' });
  } catch (err) {
    console.error('Error al eliminar lista:', err);
    res.status(500).json({ message: 'Error al eliminar lista' });
  }
};

exports.shareList = async (req, res) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'El email es obligatorio' });
    }

    const list = await List.findById(req.params.id);
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    // Solo el owner puede compartir
    if (list.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'No tienes permisos para compartir esta lista' });
    }

    let userToShare;
    try {
      const response = await axios.get(`${process.env.AUTH_SERVICE_URL}/find-by-email`, {
        params: { email },
        headers: {
          Authorization: req.headers.authorization
        }
      });
      userToShare = response.data;
    } catch (err) {
      if (err.response?.status == 404) {
        return res.status(404).json({ message: 'Usuario no encontrado' });
      }
      console.error('Error al consutlar auth-service:', err.message);
      return res.status(500).json({ message: 'Error consultando usuario' });
    }

    // No compartir consigo mismo
    if (userToShare._id.toString() === req.userId) {
      return res.status(400).json({ message: 'No puedes compartir la lista contigo mismo' });
    }

    // Verificar si ya está compartida con este usuario
    if (list.sharedWith.includes(userToShare._id)) {
      return res.status(400).json({ message: 'La lista ya está compartida con este usuario' });
    }

    list.sharedWith.push(userToShare._id);
    await list.save();
    // await list.populate('owner', 'name email');
    // await list.populate('sharedWith', 'name email');

    res.json(list);
  } catch (err) {
    console.error('Error al compartir lista:', err);
    res.status(500).json({ message: 'Error al compartir lista' });
  }
};

exports.checkAccess = async (req, res) => {
  try {
    const { id, userId } = req.params;
    const list = await List.findById(id);
    
    if (!list) {
      return res.status(404).json({ message: 'Lista no encontrada' });
    }

    const hasAccess = list.owner.toString() === userId || list.sharedWith.map(id => id.toString()).includes(userId);
    
    res.json({ hasAccess });
  } catch (err) {
    console.error('Error verificando acceso a lista:', err);
    res.status(500).json({ message: 'Error verificando acceso' });
  }
};