import playlistService from '../models/playlist-service.js';
import ContentPlaylistService from '../models/content-playlist-service.js';
import axios from 'axios';
import { config } from 'dotenv';

config();

/**
 * Add a playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function add(req, res) {
  try {
    const newPlaylist = req.body; // Assuming the playlist data is sent in the request body
    const createdPlaylist = await playlistService.createPlaylist(newPlaylist, req.session.user.id);
    await playlistService.updatePlaylistContent(createdPlaylist.id, newPlaylist.playlistContent, req.session.user.id);
    // Refetch the updated playlist to ensure we get the latest changes
    const updatedPlaylistWithContent = await playlistService.getPlaylistByIdwithContentAndUser(
      createdPlaylist.id,
      req.session.user.id
    );
    res.status(201).send(updatedPlaylistWithContent); // 201 Created
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

/**
 * List all playlists
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function list(req, res) {
  try {
    const playlists = await playlistService.getAllPlaylists(req.session.user.id);
    res.status(200).json(playlists);
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
}

/**
 * List all playlists with Content
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function listWithContent(req, res) {
  try {
    const playlists = await playlistService.getAllPlaylistsWithContentAndUser(req.session.user.id);
    res.status(200).json(playlists);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

/**
 * Get all content in a playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getContent(req, res) {
  try {
    const contentPlaylists = await ContentPlaylistService.getContentInPlaylist(req.params.id, req.session.user.id);
    return res.status(200).send(contentPlaylists);
  } catch (error) {
    console.error(error);

    return res.status(500).send(error.message);
  }
}

/**
 * Update playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update(req, res) {
  try {
    const playlistId = req.params.id; // The playlist ID is in the request parameters
    const updatedPlaylist = req.body; // The updated playlist data is sent in the request body

    // Update the playlist
    await playlistService.updatePlaylist(playlistId, updatedPlaylist, req.session.user.id);
    await playlistService.updatePlaylistContent(playlistId, updatedPlaylist.playlistContent, req.session.user.id);

    const updatedPlaylistWithContent = await playlistService.getPlaylistByIdwithContentAndUser(
      playlistId,
      req.session.user.id
    );

    res.status(200).send(updatedPlaylistWithContent);
  } catch (error) {
    console.error(error);
    res.status(500).send(error.message);
  }
}

/**
 * Delete a playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function deleteP(req, res) {
  try {
    const playlistId = req.params.id; // Assuming the playlist ID is in the request parameters
    await playlistService.deletePlaylist(playlistId, req.session.user.id);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);

    res.status(500).send(error.message);
  }
}

/**
 * Delete a playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getYoutubePlaylistInfo(req, res) {
  try {
    const playlistId = req.params.id;
    const API_KEY = process.env.GOOGLE_API_KEY;
    let nextPageToken = '';
    let allVideos = [];

    do {
      const response = await axios.get('https://www.googleapis.com/youtube/v3/playlistItems', {
        params: {
          part: 'snippet',
          playlistId,
          maxResults: 200,
          key: API_KEY,
          pageToken: nextPageToken
        }
      });

      const data = response.data;
      const videoItems = data.items.map((item) => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId
      }));

      allVideos = allVideos.concat(videoItems);
      nextPageToken = data.nextPageToken;
    } while (nextPageToken);

    return res.send(allVideos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    return res.status(500).json({ error: 'Error fetching videos' });
  }
}

export default { add, list, listWithContent, update, deleteP, getContent, getYoutubePlaylistInfo };
