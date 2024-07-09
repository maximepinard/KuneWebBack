import { Sequelize } from 'sequelize';
import { ContentPlaylist, Video, checkUserRole } from './models.js';

const VideoService = {
  getAllVideos: async (req) => {
    const where = checkUserRole(req);
    return await Video.findAll({ where });
  },
  getVideoById: async (id, req) => {
    const where = { ...checkUserRole(req), id };
    return await Video.findOne({ where });
  },
  getVideosByType: async (type, req) => {
    const where = { ...checkUserRole(req), type };
    return await Video.findAll({ where });
  },
  getVideosByDateRange: async (dateStart, dateEnd, req) => {
    const where = { ...checkUserRole(req), date: { [Sequelize.Op.between]: [dateStart, dateEnd] } };
    return await Video.findAll({ where });
  },
  createVideo: async (video, req) => {
    const newVideo = await Video.create({
      user_id: req.session.user.id,
      title: video.title,
      artist: video.artist,
      code: video.code,
      startGuess: video.startGuess,
      endGuess: video.endGuess,
      startReveal: video.startReveal,
      endReveal: video.endReveal,
      type: video.type || 'default',
      date: video.date || new Date().toISOString().split('T')[0]
    });
    return await VideoService.getVideoById(newVideo.id, req);
  },
  createVideosBulk: async (videos, req) => {
    const userId = req.session.user.id;
    const videosToCreate = videos.map((video) => ({
      user_id: userId,
      title: video.title,
      artist: video.artist,
      code: video.code,
      startGuess: video.startGuess,
      endGuess: video.endGuess,
      startReveal: video.startReveal,
      endReveal: video.endReveal,
      type: video.type || 'default',
      date: video.date || new Date().toISOString().split('T')[0]
    }));
    return await Video.bulkCreate(videosToCreate);
  },
  updateVideo: async (id, video, req) => {
    const where = { ...checkUserRole(req), id };
    await Video.update(
      {
        title: video.title,
        artist: video.artist,
        code: video.code,
        startGuess: video.startGuess,
        endGuess: video.endGuess,
        startReveal: video.startReveal,
        endReveal: video.endReveal,
        type: video.type,
        date: video.date,
        last_modified: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      { where }
    );
    return await VideoService.getVideoById(id, req);
  },
  deleteVideo: async (id, req) => {
    const where = { ...checkUserRole(req), id };
    const whereContent = { ...checkUserRole(req), content_id: id, content_type: 'video' };
    await ContentPlaylist.destroy({ whereContent });
    await Video.destroy({ where });
    return true;
  }
};

export default VideoService;
