"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jwt_1 = require("../utils/jwt");
const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        res.status(401).json({ message: 'Token no proporcionado' });
        return;
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = (0, jwt_1.verifyJwtToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};
exports.verifyToken = verifyToken;
