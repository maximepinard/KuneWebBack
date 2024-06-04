import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from 'dotenv';

config();

const dbPromise = open({
  filename: process.env.DATABASE_FILE, // Use a file-based database
  driver: sqlite3.Database
});

const Playlist = {
  // Method to get all playlists for a user
  getAllPlaylists: async (user_id) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM playlists WHERE user_id = ?', user_id);
  },

  // Method to get a playlist by its ID for a user
  getPlaylistById: async (id, user_id) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM playlists WHERE id = ? AND user_id = ?', id, user_id);
  },

  // Method to create a new playlist
  createPlaylist: async (playlist, user_id) => {
    const db = await dbPromise;
    const { lastID } = await db.run('INSERT INTO playlists (user_id, name) VALUES (?, ?)', user_id, playlist.name);
    return Playlist.getPlaylistById(lastID, user_id);
  },

  // Method to update a playlist
  updatePlaylist: async (id, playlist, user_id) => {
    const db = await dbPromise;
    await db.run(
      'UPDATE playlists SET name = ?, last_modified = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      playlist.name,
      id,
      user_id
    );
    return Playlist.getPlaylistById(id, user_id);
  },

  // Method to delete a playlist
  deletePlaylist: async (id, user_id) => {
    const db = await dbPromise;
    await db.run('DELETE FROM playlists WHERE id = ? AND user_id = ?', id, user_id);
    return true;
  }
};

export default Playlist;
