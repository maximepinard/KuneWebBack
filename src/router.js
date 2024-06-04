import express from "express";

import userController from "./controllers/user-controller.js";
import videoController from "./controllers/video-controller.js";
import playListController from "./controllers/playlist-controller.js";

const router = express.Router();

function isAuthenticated(req, res, next) {
  if (req.session.user) {
    // User is authenticated, proceed to the next middleware
    next();
  } else {
    // User is not authenticated, redirect to login page or send a 401 status
    res.status(401).send("Unauthorized");
  }
}

//user
router.get("/user", userController.check);
router.post("/user/login", userController.login);
router.post("/user/register", userController.register);
router.post("/user/logout", userController.logout);

//videos
router.get("/videos", isAuthenticated, videoController.list);
router.post("/videos", isAuthenticated, videoController.add);
router.patch("/videos/:id", isAuthenticated, videoController.update);
router.delete("/videos/:id", isAuthenticated, videoController.deleteV);

//playlists
router.get("/playlists", isAuthenticated, playListController.list);
router.get("/playlists/:id", isAuthenticated, playListController.getVideos);
router.post("/playlists", isAuthenticated, playListController.add);
router.patch("/playlists/:id", isAuthenticated, playListController.update);
router.delete("/playlists/:id", isAuthenticated, playListController.deleteP);

export default router;
