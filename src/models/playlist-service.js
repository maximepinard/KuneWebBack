import { Playlist, ContentPlaylist, User, Image, Video } from './models.js';
import { Op } from 'sequelize';

const PlaylistService = {
  getAllPlaylists: async (user_id) => {
    return await Playlist.findAll({
      where: {
        [Op.or]: [{ user_id }, { public: true }]
      }
    });
  },
  getAllPlaylistsWithContentAndUser: async (user_id) => {
    return await Playlist.findAll({
      where: {
        [Op.or]: [{ user_id }, { public: true }]
      },
      include: [
        {
          model: ContentPlaylist,
          as: 'contentPlaylists',
          include: [
            {
              model: Video,
              as: 'video',
              required: false,
              where: { '$contentPlaylists.content_type$': 'video' }
            },
            {
              model: Image,
              as: 'image',
              required: false,
              where: { '$contentPlaylists.content_type$': 'image' }
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'login'] // Include only the name attribute
        }
      ]
    });
  },
  getPlaylistById: async (id, user_id) => {
    return await Playlist.findOne({
      where: { id, user_id }
    });
  },
  getPlaylistByIdwithContentAndUser: async (id, user_id) => {
    return await Playlist.findOne({
      where: { id, user_id },
      include: [
        {
          model: ContentPlaylist,
          as: 'contentPlaylists',
          include: [
            {
              model: Video,
              as: 'video',
              required: false,
              where: { '$contentPlaylists.content_type$': 'video' }
            },
            {
              model: Image,
              as: 'image',
              required: false,
              where: { '$contentPlaylists.content_type$': 'image' }
            }
          ]
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'login'] // Include only the name attribute
        }
      ]
    });
  },
  getPlaylistByType: async (type, user_id) => {
    return await Playlist.findAll({
      where: { type, user_id }
    });
  },
  createPlaylist: async (playlist, user_id) => {
    const newPlaylist = await Playlist.create({
      user_id,
      name: playlist.name,
      type: playlist.type || 'default'
    });
    return await PlaylistService.getPlaylistByIdwithContentAndUser(newPlaylist.id, user_id);
  },
  updatePlaylist: async (id, playlist, user_id) => {
    await Playlist.update(
      {
        name: playlist.name,
        type: playlist.type,
        public: playlist.public,
        last_modified: new Date()
      },
      {
        where: { id, user_id }
      }
    );
    return await PlaylistService.getPlaylistByIdwithContentAndUser(id, user_id);
  },
  updatePlaylistContent: async (id, newContent, user_id) => {
    // Check if there is existing content in the playlist
    const existingContent = await ContentPlaylist.findAll({
      where: { playlist_id: id, user_id }
    });

    // If there is existing content, remove it
    if (existingContent.length > 0) {
      await ContentPlaylist.destroy({
        where: { playlist_id: id, user_id }
      });
    }

    // Add new content to the playlist
    await Promise.all(
      newContent.map((c, index) =>
        ContentPlaylist.create({
          playlist_id: id,
          content_id: c.content_id,
          content_type: c.content_type,
          user_id,
          order: index
        })
      )
    );
  },
  deletePlaylist: async (id, user_id) => {
    // Check if there is existing content in the playlist
    const existingContent = await ContentPlaylist.findAll({
      where: { playlist_id: id, user_id }
    });

    // If there is existing content, remove it
    if (existingContent.length > 0) {
      await ContentPlaylist.destroy({
        where: { playlist_id: id, user_id }
      });
    }

    await Playlist.destroy({
      where: { id, user_id }
    });
    return true;
  }
};

export default PlaylistService;
