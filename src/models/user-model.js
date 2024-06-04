import bcrypt from 'bcryptjs';
import { open } from 'sqlite';
import sqlite3 from 'sqlite3';
import { config } from 'dotenv';

config();

const dbPromise = open({
  filename: process.env.DATABASE_FILE, // Use a file-based database
  driver: sqlite3.Database
});

const User = {
  // Method to get a user by username
  getUserByUsername: async (username) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM users WHERE login = ?', username);
  },

  // Method to create a new user
  createUser: async (username, password, email) => {
    const db = await dbPromise;
    const hashedPassword = bcrypt.hashSync(password, 10);
    const { lastID } = await db.run(
      'INSERT INTO users (login, password, email) VALUES (?, ?, ?)',
      username,
      hashedPassword,
      email
    );
    return lastID;
  },

  // Method to authenticate a user
  authenticateUser: async (username, password) => {
    const user = await User.getUserByUsername(username);
    if (user && bcrypt.compareSync(password, user.password)) {
      return user;
    }
    return null;
  }
};

export default User;
