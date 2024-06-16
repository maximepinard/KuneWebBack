import { ContentPlaylist } from "./models.js";

const ContentPlaylistService = {
  addContentToPlaylist: async (content, playlistId, userId) => {
    const contentPlaylist = await ContentPlaylist.create({
      content_id: content.content_id,
      content_type: content.content_type,
      playlist_id: playlistId,
      user_id: userId,
      order_num: 0, // You might want to adjust this based on your requirements
    });
    return contentPlaylist;
  },

  removeContentFromPlaylist: async (content, playlistId, userId) => {
    await ContentPlaylist.destroy({
      where: {
        content_id: content.content_id,
        content_type: content.content_type,
        playlist_id: playlistId,
        user_id: userId,
      },
    });
    return true;
  },

  getContentInPlaylist: async (playlistId, userId) => {
    const contentPlaylists = await ContentPlaylist.findAll({
      where: {
        playlist_id: playlistId,
        user_id: userId,
      },
    });
    return contentPlaylists;
  },

  updateContentOrder: async (content, playlistId, userId, orderNum) => {
    await ContentPlaylist.update(
      { order_num: orderNum },
      {
        where: {
          content_id: content.content_id,
          content_type: content.content_type,
          playlist_id: playlistId,
          user_id: userId,
        },
      },
    );
    return true;
  },
};

export default ContentPlaylistService;
