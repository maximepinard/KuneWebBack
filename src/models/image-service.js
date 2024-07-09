import { ContentPlaylist, Image, checkUserRole } from './models.js';

const ImageService = {
  getAllImages: async (req) => {
    const where = checkUserRole(req);
    return await Image.findAll({ where });
  },
  getImageById: async (id, req) => {
    const where = { ...checkUserRole(req), id };
    return await Image.findOne({ where });
  },
  getImagesByType: async (type, req) => {
    const where = { ...checkUserRole(req), type };
    return await Image.findAll({ where });
  },
  getImagesByDateRange: async (dateStart, dateEnd, req) => {
    const where = { ...checkUserRole(req), date: { [Sequelize.Op.between]: [dateStart, dateEnd] } };
    return await Image.findAll({ where });
  },
  createImage: async (image, req) => {
    const newImage = await Image.create({
      user_id: req.session.user.id,
      name: image.name,
      description: image.description,
      type: image.type || 'default',
      date: image.date || new Date().toISOString().split('T')[0]
    });
    return await ImageService.getImageById(newImage.id, req);
  },
  updateImage: async (id, image, req) => {
    const where = { ...checkUserRole(req), id };
    await Image.update(
      {
        name: image.name,
        description: image.description,
        type: image.type,
        date: image.date,
        last_modified: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      { where }
    );
    return await ImageService.getImageById(id, req);
  },
  deleteImage: async (id, req) => {
    const where = { ...checkUserRole(req), id };
    const whereContent = { ...checkUserRole(res), content_id: id, content_type: 'image' };
    await ContentPlaylist.destroy({ whereContent });
    await Image.destroy({ where });
    return true;
  }
};

export default ImageService;
