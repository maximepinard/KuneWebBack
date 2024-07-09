import { Sequelize, DataTypes, Model } from 'sequelize';
import { config } from 'dotenv';

config();

const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: process.env.DATABASE_FILE,
  logging: process.env.DEBUG === 'true' ? console.log : false // Set to true if you want to see SQL queries in the console
});

class User extends Model {}
User.init(
  {
    role: DataTypes.STRING,
    login: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_login: DataTypes.DATE
  },
  { sequelize, modelName: 'User' }
);

class Video extends Model {}
Video.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    title: DataTypes.STRING,
    artist: DataTypes.STRING,
    code: DataTypes.STRING,
    startGuess: DataTypes.INTEGER,
    endGuess: DataTypes.INTEGER,
    startReveal: DataTypes.INTEGER,
    endReveal: DataTypes.INTEGER,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    type: DataTypes.STRING,
    date: DataTypes.DATE
  },
  { sequelize, modelName: 'Video' }
);

class Image extends Model {}
Image.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    description: DataTypes.STRING,
    type: DataTypes.STRING,
    date: DataTypes.STRING
  },
  { sequelize, modelName: 'Image' }
);

class Playlist extends Model {}
Playlist.init(
  {
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    name: DataTypes.STRING,
    created_at: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    last_modified: {
      type: DataTypes.DATE,
      defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
    },
    type: DataTypes.STRING,
    public: DataTypes.BOOLEAN
  },
  { sequelize, modelName: 'Playlist' }
);

class ContentPlaylist extends Model {}
ContentPlaylist.init(
  {
    content_type: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    content_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    playlist_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    user_id: {
      type: DataTypes.INTEGER,
      references: {
        model: User,
        key: 'id'
      }
    },
    order_num: DataTypes.INTEGER
  },
  { sequelize, modelName: 'ContentPlaylist', timestamps: false }
);

class MetaData extends Model {}
MetaData.init(
  {
    content_id: {
      type: DataTypes.INTEGER,
      primaryKey: true
    },
    key: {
      type: DataTypes.STRING,
      primaryKey: true
    },
    value: DataTypes.TEXT,
    type: DataTypes.STRING
  },
  { sequelize, modelName: 'MetaData' }
);

class GameSet extends Model {}
GameSet.init(
  {
    name: DataTypes.STRING,
    options: DataTypes.TEXT,
    password: DataTypes.STRING
  },
  { sequelize, modelName: 'GameSet' }
);

// Define the association
Playlist.hasMany(ContentPlaylist, { foreignKey: 'playlist_id', as: 'contentPlaylists' });
Playlist.belongsTo(User, { foreignKey: 'user_id', as: 'user' });
ContentPlaylist.belongsTo(Video, { foreignKey: 'content_id', targetKey: 'id', as: 'video' });
ContentPlaylist.belongsTo(Image, { foreignKey: 'content_id', targetKey: 'id', as: 'image' });
Video.hasMany(ContentPlaylist, { foreignKey: 'content_id', constraints: false, scope: { content_type: 'video' } });
Image.hasMany(ContentPlaylist, { foreignKey: 'content_id', constraints: false, scope: { content_type: 'image' } });

const checkUserRole = (req) => {
  if (req.session && (req.session.user.role === 'admin' || req.session.user.role === 'super-admin')) {
    return {};
  } else {
    return { user_id: req.session.user.id };
  }
};

export { sequelize, User, Video, Playlist, ContentPlaylist, Image, MetaData, GameSet, checkUserRole };
