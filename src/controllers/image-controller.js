import ImageService from '../models/image-service.js';

/**
 * Add an image
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function add(req, res) {
  try {
    const newImage = req.body; // Assuming the image data is sent in the request body
    const image = await ImageService.createImage(newImage, req);
    return res.status(201).send(image); // 201 Created
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

/**
 * List all images
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function list(req, res) {
  try {
    const images = await ImageService.getAllImages(req);
    return res.status(200).send(images);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

/**
 * Update image
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function update(req, res) {
  try {
    const imageId = req.params.id; // Assuming the image ID is in the request parameters
    const updatedImage = req.body; // Assuming the updated image data is sent in the request body
    const image = await ImageService.updateImage(imageId, updatedImage, req);
    return res.status(200).send(image);
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

/**
 * Delete an image
 * @param {import("express").Request} req
 * @param {import("express").Response} res
 */
async function deleteI(req, res) {
  try {
    const imageId = req.params.id; // Assuming the image ID is in the request parameters
    await ImageService.deleteImage(imageId, req);
    return res.status(204).send(); // 204 No Content
  } catch (error) {
    console.error(error);
    return res.status(500).send(error.message);
  }
}

export default { add, list, update, deleteI };
