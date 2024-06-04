import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import { config } from 'dotenv';

config();

const dbPromise = open({
  filename: process.env.DATABASE_FILE, // Use a file-based database
  driver: sqlite3.Database
});

const VideoPlaylist = {
  // Method to add a video to a playlist
  addVideoToPlaylist: async (video_id, playlist_id, user_id) => {
    const db = await dbPromise;
    await db.run(
      'INSERT INTO video_playlists (video_id, playlist_id, user_id) VALUES (?, ?, ?)',
      video_id,
      playlist_id,
      user_id
    );
    return true;
  },

  // Method to remove a video from a playlist
  removeVideoFromPlaylist: async (video_id, playlist_id, user_id) => {
    const db = await dbPromise;
    await db.run(
      'DELETE FROM video_playlists WHERE video_id = ? AND playlist_id = ? AND user_id = ?',
      video_id,
      playlist_id,
      user_id
    );
    return true;
  },

  // Method to get all videos in a playlist
  getVideosInPlaylist: async (playlist_id, user_id) => {
    const db = await dbPromise;
    return db.all(
      `SELECT videos.*
      FROM videos
      INNER JOIN video_playlists ON videos.id = video_playlists.video_id
      WHERE video_playlists.playlist_id = ? AND video_playlists.user_id = ?`,
      playlist_id,
      user_id
    );
  },

  // Method to get all playlists containing a video
  getPlaylistsForVideo: async (video_id, user_id) => {
    const db = await dbPromise;
    return db.all(
      `SELECT playlists.*
      FROM playlists
      INNER JOIN video_playlists ON playlists.id = video_playlists.playlist_id
      WHERE video_playlists.video_id = ? AND video_playlists.user_id = ?`,
      video_id,
      user_id
    );
  },

  addVideosToPlaylist: async (videoIds, playlist_id, user_id) => {
    const db = await dbPromise;

    // Construct the values placeholder for the INSERT INTO query
    const valuesPlaceholder = videoIds.map(() => '(?, ?, ?)').join(', ');

    // Flatten the videoIds array and add the playlist_id and user_id for each video
    const values = videoIds.flatMap((video_id) => [video_id, playlist_id, user_id]);

    // Execute the INSERT INTO query with multiple rows
    await db.run(
      `INSERT INTO video_playlists (video_id, playlist_id, user_id)
       VALUES ${valuesPlaceholder}`,
      values
    );

    return true;
  },

  // Method to remove all video IDs from a playlist
  removeAllVideosFromPlaylist: async (playlist_id, user_id) => {
    const db = await dbPromise;
    await db.run('DELETE FROM video_playlists WHERE playlist_id = ? AND user_id = ?', playlist_id, user_id);
    return true;
  }
};

export default VideoPlaylist;
