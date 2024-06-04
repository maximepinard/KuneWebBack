import express from 'express';

import userController from './controllers/user-controller.js';
import videoController from './controllers/video-controller.js';
import playListController from './controllers/playlist-controller.js';
import imageController from './controllers/image-controller.js';

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware
    next();
  } else {
    // User is not authenticated, redirect to login page or send a 401 status
    res.status(401).send('Unauthorized');
  }
}

//user
router.get('/user', userController.check);
router.post('/user/login', userController.login);
router.post('/user/register', userController.register);
router.post('/user/logout', userController.logout);

//videos
router.get('/videos', isAuthenticated, videoController.list);
router.post('/videos', isAuthenticated, videoController.add);
router.post('/videos/addBulk', isAuthenticated, videoController.addBulk);
router.patch('/videos/:id', isAuthenticated, videoController.update);
router.delete('/videos/:id', isAuthenticated, videoController.deleteV);

//images
router.get('/images', isAuthenticated, imageController.list);
router.post('/images', isAuthenticated, imageController.add);
router.patch('/images/:id', isAuthenticated, imageController.update);
router.delete('/images/:id', isAuthenticated, imageController.deleteI);

//playlists
router.get('/playlists', isAuthenticated, playListController.list);
router.get('/playlists/full', isAuthenticated, playListController.listWithContent);
router.get('/playlists/youtube/:id', isAuthenticated, playListController.getYoutubePlaylistInfo);
router.get('/playlists/:id', isAuthenticated, playListController.getContent);
router.post('/playlists', isAuthenticated, playListController.add);
router.patch('/playlists/:id', isAuthenticated, playListController.update);
router.delete('/playlists/:id', isAuthenticated, playListController.deleteP);

export default router;
