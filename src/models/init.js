import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from 'dotenv';

config();

export async function initDB() {
  // Open the database
  const db = await open({
    filename: process.env.DATABASE_FILE, // Use a file-based database
    driver: sqlite3.Database
  });

  // Create the tables if they don't exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      login VARCHAR(255),
      email VARCHAR(255),
      password VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_login DATETIME
    );

    CREATE TABLE IF NOT EXISTS videos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      code VARCHAR(255),
      user_id INTEGER,
      title VARCHAR(255),
      artist VARCHAR(255),
      startGuess INTEGER,
      endGuess INTEGER,
      startReveal INTEGER,
      endReveal INTEGER,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS playlists (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      name VARCHAR(255),
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      last_modified DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(user_id) REFERENCES users(id)
    );

    CREATE TABLE IF NOT EXISTS video_playlists (
      video_id INTEGER,
      playlist_id INTEGER,
      user_id INTEGER,
      FOREIGN KEY(video_id) REFERENCES videos(id),
      FOREIGN KEY(playlist_id) REFERENCES playlists(id),
      FOREIGN KEY(user_id) REFERENCES users(id)
    );
  `);

  // Log all table names to verify creation
  // const tables = await db.all(
  // "SELECT name FROM sqlite_master WHERE type='table'",
  // );
  // console.log(tables.map((table) => table.name));

  // Close the database connection
  await db.close();
}
