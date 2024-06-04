import bcrypt from 'bcryptjs';
import { User } from './models.js'; // Adjust the import path as necessary

const UserService = {
  // Method to get a user by username
  getUserByUsername: async (username) => {
    return await User.findOne({
      where: { login: username }
    });
  },

  // Method to get a user by ID
  getUserById: async (id) => {
    return await User.findOne({
      where: { id }
    });
  },

  // Method to create a new user
  createUser: async (username, password, email) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      login: username,
      password: hashedPassword,
      email: email,
      role: 'member' // Assuming a default role
    });
    return user;
  },

  // Method to authenticate a user
  authenticateUser: async (username, password) => {
    const user = await UserService.getUserByUsername(username);
    if (user && (await bcrypt.compare(password, user.password))) {
      await User.update({ last_login: new Date() }, { where: { login: username } });
      return user;
    }
    return null;
  }
};

export default UserService;
