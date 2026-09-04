"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const database_1 = __importDefault(require("../config/database"));
class User extends sequelize_1.Model {
}
User.init({
    id: {
        type: sequelize_1.DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
    },
    name: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: { isEmail: true },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bio: {
        type: sequelize_1.DataTypes.STRING(255),
        allowNull: true,
    },
    avatar: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
    },
    role: {
        type: sequelize_1.DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
    },
    resetToken: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: true,
        defaultValue: null,
    },
    resetTokenExpiry: {
        type: sequelize_1.DataTypes.DATE,
        allowNull: true,
        defaultValue: null,
    },
    createdAt: sequelize_1.DataTypes.DATE,
    updatedAt: sequelize_1.DataTypes.DATE,
}, {
    sequelize: database_1.default,
    tableName: 'users',
    timestamps: true,
});
exports.default = User;
