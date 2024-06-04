import { ContentPlaylist, sequelize } from './models.js';
import { Sequelize } from 'sequelize';

const ContentPlaylistService = {
  addContentToPlaylist: async (content, playlistId, userId) => {
    const contentPlaylist = await ContentPlaylist.create({
      content_id: content.content_id,
      content_type: content.content_type,
      playlist_id: playlistId,
      user_id: userId,
      order_num: content.order_num || 0 // You might want to adjust this based on your requirements
    });
    return contentPlaylist;
  },

  removeContentFromPlaylist: async (content, playlistId, userId) => {
    await ContentPlaylist.destroy({
      where: {
        content_id: content.content_id,
        content_type: content.content_type,
        playlist_id: playlistId,
        user_id: userId
      }
    });
    return true;
  },

  getContentInPlaylist: async (playlistId, userId) => {
    const videoQuery = `
    SELECT 
      cp.*, 
      v.*
    FROM ContentPlaylists cp
    INNER JOIN Playlists p ON cp.playlist_id = p.id
    INNER JOIN Videos v ON cp.content_type = 'video' AND cp.content_id = v.id
    WHERE p.id = :playlistId AND (p.user_id = :userId OR p.public = true)
  `;

    const imageQuery = `
    SELECT 
      cp.*, 
      i.*
    FROM ContentPlaylists cp
    INNER JOIN Playlists p ON cp.playlist_id = p.id
    INNER JOIN Images i ON cp.content_type = 'image' AND cp.content_id = i.id
    WHERE p.id = :playlistId AND (p.user_id = :userId OR p.public = true)
  `;

    const replacements = {
      playlistId,
      userId
    };

    const videoResults = await sequelize.query(videoQuery, {
      replacements,
      type: Sequelize.QueryTypes.SELECT
    });

    const imageResults = await sequelize.query(imageQuery, {
      replacements,
      type: Sequelize.QueryTypes.SELECT
    });

    // Combine the results
    const detailedContent = [
      ...videoResults.map((result) => ({ ...result, content_type: 'video' })),
      ...imageResults.map((result) => ({ ...result, content_type: 'image' }))
    ];

    return detailedContent;
  },

  updateContentOrder: async (content, playlistId, userId, orderNum) => {
    await ContentPlaylist.update(
      { order_num: orderNum },
      {
        where: {
          content_id: content.content_id,
          content_type: content.content_type,
          playlist_id: playlistId,
          user_id: userId
        }
      }
    );
    return true;
  }
};

export default ContentPlaylistService;
