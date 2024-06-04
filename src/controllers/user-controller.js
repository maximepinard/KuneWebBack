import UserModel from "../models/user-model.js";

/**
 * Register
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */

async function register(req, res) {
  const { username, password, email } = req.body;
  try {
    const userId = await UserModel.createUser(username, password, email);
    req.session.user = { id: userId, login: username };
    req.session.save(function (err) {
      return res.send({ message: "Registered and logged in successfully" });
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Registration failed" });
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
    const user = await UserModel.authenticateUser(username, password);
    if (user) {
      req.session.user = { id: user.id, login: user.login };
      req.session.save(function (err) {
        return res.send({ message: "Logged in successfully" });
      });
    } else {
      return res.status(401).json({ message: "Invalid username or password" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Login failed" });
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
      return res.status(500).json({ message: "Logout failed" });
    } else {
      return res.send({ message: "Logged out successfully" });
    }
  });
}

function check(req, res) {
  return res.send(req?.session?.user?.login ?? null);
}

export default { check, login, logout, register };
