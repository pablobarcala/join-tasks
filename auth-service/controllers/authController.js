const jwt = require('jsonwebtoken');
const User = require('../models/User');

const createToken = (user) => {
  return jwt.sign({ userId: user._id, name: user.name }, process.env.JWT_SECRET, {
    expiresIn: '7d',
  });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validación básica
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    if (password.length < 6) {
      return res.status(400).json({ message: "La contraseña debe tener al menos 6 caracteres" })
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Ya existe el usuario' });

    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user);
    res.status(201).json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    console.error('Error en register:', err);
    res.status(500).json({ message: 'Error al registrar' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email y contraseña son obligatorios' })
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Credenciales inválidas' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = createToken(user);
    res.json({ 
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      } 
    });
  } catch (err) {
    console.error('Error en login:', err);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};

// Obtener perfil del usuario autenticado
exports.getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Error al obtener perfil' });
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.query;
  if (!email) return res.status(400).json({ message: 'Email requerido' });

  try {
    const user = await User.findOne({ email }).select('_id name email');
    if (!user) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error al buscar usuario por email:', err);
    res.status(500).json({ message: 'Error interno' });
  }
};