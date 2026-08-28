import sequelize from '../config/database';
import User from './User';
import Post from './Post';
import Comment from './Comment';
import Like from './Like';
import Follow from './Follow';

User.hasMany(Post, { foreignKey: 'userId', onDelete: 'CASCADE' });
Post.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Comment, { foreignKey: 'postId', onDelete: 'CASCADE' });
Comment.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Comment, { foreignKey: 'userId', onDelete: 'CASCADE' });
Comment.belongsTo(User, { foreignKey: 'userId' });

User.hasMany(Like, { foreignKey: 'userId', onDelete: 'CASCADE' });
Like.belongsTo(User, { foreignKey: 'userId' });

Post.hasMany(Like, { foreignKey: 'postId', onDelete: 'CASCADE' });
Like.belongsTo(Post, { foreignKey: 'postId' });

User.hasMany(Follow, { foreignKey: 'followerId', as: 'following', onDelete: 'CASCADE' });
User.hasMany(Follow, { foreignKey: 'followingId', as: 'followers', onDelete: 'CASCADE' });

Follow.belongsTo(User, { foreignKey: 'followerId', as: 'follower' });
Follow.belongsTo(User, { foreignKey: 'followingId', as: 'followed' });

export { sequelize, User, Post, Comment, Like, Follow };