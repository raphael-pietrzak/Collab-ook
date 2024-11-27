const authService = require('../services/auth.service');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('email', email);
  console.log('password', password);
  try {
    const { user, token } = await authService.login(email, password);
    res.json({ user, token });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};

exports.register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const user = await authService.register(username, email, password);
    res.status(201).json({ user });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};