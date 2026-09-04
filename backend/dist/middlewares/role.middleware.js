"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkRole = void 0;
const checkRole = (...allowedRoles) => {
    return (req, res, next) => {
        if (!req.user) {
            res.status(401).json({ message: 'No autenticado' });
            return;
        }
        if (!allowedRoles.includes(req.user.role)) {
            res.status(403).json({ message: 'No tienes permisos para realizar esta acción' });
            return;
        }
        next();
    };
};
exports.checkRole = checkRole;
