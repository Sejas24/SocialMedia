"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Follow extends sequelize_1.Model {
}
Follow.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    followerId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    followingId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.default,
    tableName: 'follows',
    timestamps: true,
    indexes: [
        {
            unique: true,
            fields: ['followerId', 'followingId'],
        },
    ],
});
exports.default = Follow;
