"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    dialect: 'mysql',
    logging: false,
});
exports.default = sequelize;
