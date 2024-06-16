import { Playlist } from './models.js';

const PlaylistService = {
  getAllPlaylists: async (user_id) => {
    return await Playlist.findAll({
      where: { user_id }
    });
  },
  getPlaylistById: async (id, user_id) => {
    return await Playlist.findOne({
      where: { id, user_id }
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
    return await PlaylistService.getPlaylistById(newPlaylist.id, user_id);
  },
  updatePlaylist: async (id, playlist, user_id) => {
    await Playlist.update(
      {
        name: playlist.name,
        type: playlist.type,
        last_modified: new Date()
      },
      {
        where: { id, user_id }
      }
    );
    return await PlaylistService.getPlaylistById(id, user_id);
  },
  deletePlaylist: async (id, user_id) => {
    await Playlist.destroy({
      where: { id, user_id }
    });
    return true;
  }
};

export default PlaylistService;
