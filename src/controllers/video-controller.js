import VideoModel from "../models/video-model.js";

/**
 * Add a video
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function add(req, res) {
  try {
    const newVideo = req.body; // Assuming the video data is sent in the request body
    const video = await VideoModel.createVideo(newVideo, req.session.user.id);
    return res.status(201).send(video); // 201 Created
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

/**
 * List all video
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function list(req, res) {
  try {
    const videos = await VideoModel.getAllVideos(req.session.user.id);
    return res.status(200).send(videos);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

/**
 * Update video
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update(req, res) {
  try {
    const videoId = req.params.id; // Assuming the video ID is in the request parameters
    const updatedVideo = req.body; // Assuming the updated video data is sent in the request body
    const video = await VideoModel.updateVideo(
      videoId,
      updatedVideo,
      req.session.user.id,
    );
    return res.status(200).send(video);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

/**
 * Delete a video
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function deleteV(req, res) {
  try {
    const videoId = req.params.id; // Assuming the video ID is in the request parameters
    await VideoModel.deleteVideo(videoId, req.session.user.id);
    return res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

export default { add, list, update, deleteV };
