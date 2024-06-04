import PlaylistModel from "../models/playlist-model.js";
import VideoPlaylist from "../models/video-playlist-model.js";

/**
 * Add a playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function add(req, res) {
  try {
    const newPlaylist = req.body; // Assuming the playlist data is sent in the request body
    await PlaylistModel.createPlaylist(newPlaylist, req.session.user.id);
    await VideoPlaylist.addVideosToPlaylist(
      newPlaylist.videoIds,
      newPlaylist.id,
      req.session.user.id,
    );
    res.status(201).json(newPlaylist); // 201 Created
  } catch (error) {
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
    const playlists = await PlaylistModel.getAllPlaylists(req.session.user.id);
    res.status(200).json(playlists);
  } catch (error) {
    res.status(500).send(error.message);
  }
}

/**
 * List all playlists
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function getVideos(req, res) {
  try {
    const videos = await VideoPlaylist.getVideosInPlaylist(
      req.params.id,
      req.session.user.id,
    );
    return res.status(200).send(videos);
  } catch (error) {
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
    const playlistId = req.params.id; // Assuming the playlist ID is in the request parameters
    const updatedPlaylist = req.body; // Assuming the updated playlist data is sent in the request body
    await PlaylistModel.updatePlaylist(
      playlistId,
      updatedPlaylist,
      req.session.user.id,
    );
    await VideoPlaylist.removeAllVideosFromPlaylist(
      updatedPlaylist.id,
      req.session.user.id,
    );
    await VideoPlaylist.addVideosToPlaylist(
      updatedPlaylist.videoIds,
      updatedPlaylist.id,
      req.session.user.id,
    );
    res.status(200).json(updatedPlaylist);
  } catch (error) {
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
    await PlaylistModel.deletePlaylist(playlistId, req.session.user.id);
    res.status(204).send(); // 204 No Content
  } catch (error) {
    res.status(500).send(error.message);
  }
}

export default { add, list, update, deleteP, getVideos };
