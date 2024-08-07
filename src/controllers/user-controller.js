import userService from '../models/user-service.js';

/**
 * Register
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function register(req, res) {
  const { username, password, email } = req.body;
  try {
    const user = await userService.createUser(username, password, email);
    req.session.user = { id: user.id, login: user.login, role: user.role };
    req.session.save(function (err) {
      return res.send({ login: user.login, id: user.id });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Registration failed' });
  }
}

/**
 * Login
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function login(req, res) {
  const { username, password } = req.body;
  try {
    const user = await userService.authenticateUser(username, password);
    if (user) {
      req.session.user = { id: user.id, login: user.login, role: user.role };
      req.session.save(function (err) {
        return res.send({ login: user.login, id: user.id });
      });
    } else {
      return res.status(400).json({ message: 'Invalid username or password' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Login failed' });
  }
}

/**
 * Logout
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
function logout(req, res) {
  req.session.destroy((err) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ message: 'Logout failed' });
    } else {
      return res.send({ message: 'Logged out successfully' });
    }
  });
}

function check(req, res) {
  if (req?.session?.user?.login) {
    return res.send({ login: req.session.user.login, id: req.session.user.id });
  }
  return null;
}

export default { check, login, logout, register };
