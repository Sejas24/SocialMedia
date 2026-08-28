import { DataTypes, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from 'sequelize';
import sequelize from '../config/database';
import User from './User';

class Follow extends Model<InferAttributes<Follow>, InferCreationAttributes<Follow>> {
  declare id: CreationOptional<number>;
  declare followerId: ForeignKey<User['id']>;
  declare followingId: ForeignKey<User['id']>;
  declare readonly createdAt: CreationOptional<Date>;
  declare readonly updatedAt: CreationOptional<Date>;
}

Follow.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    followerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    followingId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    createdAt: DataTypes.DATE,
    updatedAt: DataTypes.DATE,
  },
  {
    sequelize,
    tableName: 'follows',
    timestamps: true,
    indexes: [
      {
        unique: true,
        fields: ['followerId', 'followingId'],
      },
    ],
  }
);

export default Follow;