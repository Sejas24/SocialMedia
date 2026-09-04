"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class Comment extends sequelize_1.Model {
}
Comment.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    content: {
        type: sequelize_1.DataTypes.STRING(500),
        allowNull: false,
    },
    userId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    postId: {
        type: sequelize_1.DataTypes.INTEGER,
        allowNull: false,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.default,
    tableName: 'comments',
    timestamps: true,
});
exports.default = Comment;
