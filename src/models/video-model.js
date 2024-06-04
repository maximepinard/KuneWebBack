import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from 'dotenv';

config();

const dbPromise = open({
  filename: process.env.DATABASE_FILE, // Use a file-based database
  driver: sqlite3.Database
});

// Video model methods
const Video = {
  getAllVideos: async (user_id) => {
    const db = await dbPromise;
    return db.all('SELECT * FROM videos where user_id = ?', user_id);
  },
  getVideoById: async (id, user_id) => {
    const db = await dbPromise;
    return db.get('SELECT * FROM videos WHERE id = ? and user_id = ?', id, user_id);
  },
  createVideo: async (video, user_id) => {
    const db = await dbPromise;
    const { lastID } = await db.run(
      'INSERT INTO videos (user_id, title, artist, code, startGuess, endGuess, startReveal, endReveal) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      user_id,
      video.title,
      video.artist,
      video.code,
      video.startGuess,
      video.endGuess,
      video.startReveal,
      video.endReveal
    );
    return await Video.getVideoById(lastID, user_id);
  },
  updateVideo: async (id, video, user_id) => {
    const db = await dbPromise;
    await db.run(
      'UPDATE videos SET user_id = ?, title = ?, artist = ?, code = ?, startGuess = ?, endGuess = ?, startReveal = ?, endReveal = ? WHERE id = ?',
      user_id,
      video.title,
      video.artist,
      video.code,
      video.startGuess,
      video.endGuess,
      video.startReveal,
      video.endReveal,
      id
    );
    return await Video.getVideoById(id, user_id);
  },
  deleteVideo: async (id, user_id) => {
    const db = await dbPromise;
    await db.run('DELETE FROM videos WHERE id = ? and user_id = ?', id, user_id);
    return true;
  }
};

export default Video;
