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
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Ya existe el usuario' });

    const user = new User({ name, email, password });
    await user.save();

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error al registrar' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Usuario no encontrado' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'Contraseña incorrecta' });

    const token = createToken(user);
    res.json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};
