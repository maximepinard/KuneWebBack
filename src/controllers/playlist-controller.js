import playlistService from "../models/playlist-service.js";
import ContentPlaylistService from "../models/content-playlist-service.js";

/**
 * Add a playlist
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function add(req, res) {
  try {
    const newPlaylist = req.body; // Assuming the playlist data is sent in the request body
    const createdPlaylist = await playlistService.createPlaylist(
      newPlaylist,
      req.session.user.id,
    );
    await Promise.all(
      newPlaylist.playlistContent.map((c) =>
        ContentPlaylistService.addContentToPlaylist(
          c,
          createdPlaylist.id,
          req.session.user.id,
        ),
      ),
    );
    res.status(201).json(createdPlaylist); // 201 Created
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
    const playlists = await playlistService.getAllPlaylists(
      req.session.user.id,
    );
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
    const contentPlaylists = await ContentPlaylistService.getContentInPlaylist(
      req.params.id,
      req.session.user.id,
    );
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
    await playlistService.updatePlaylist(
      playlistId,
      updatedPlaylist,
      req.session.user.id,
    );
    await ContentPlaylistService.getContentInPlaylist(
      playlistId,
      req.session.user.id,
    ).then((contentPlaylists) => {
      contentPlaylists.forEach((c) => {
        ContentPlaylistService.removeContentFromPlaylist(
          c,
          playlistId,
          req.session.user.id,
        );
      });
    });
    await Promise.all(
      updatedPlaylist.playlistContent.map((c, index) =>
        ContentPlaylistService.addContentToPlaylist(
          c,
          playlistId,
          req.session.user.id,
          index,
        ),
      ),
    );
    res.status(200).json(updatedPlaylist);
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

export default { add, list, update, deleteP, getContent };
