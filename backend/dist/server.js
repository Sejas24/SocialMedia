"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const app_1 = __importDefault(require("./app"));
const models_1 = require("./models");
const PORT = process.env.PORT || 3000;
const startServer = async () => {
    try {
        await models_1.sequelize.authenticate();
        console.log('Conexión a MySQL establecida correctamente.');
        await models_1.sequelize.sync({ alter: true });
        console.log('Modelos sincronizados con la base de datos.');
        app_1.default.listen(PORT, () => {
            console.log(`Servidor corriendo en http://localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error('Error al conectar con la base de datos:', error);
    }
};
startServer();
