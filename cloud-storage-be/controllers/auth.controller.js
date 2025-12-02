const { register: registerService, login: loginService } = require('../services/auth.service');

const register = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    const { user, token } = await registerService(username, email, password);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const { user, token } = await loginService(email, password);
    res.json({ user, token });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

module.exports = { register, login };
