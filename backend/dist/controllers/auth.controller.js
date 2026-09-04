"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPassword = exports.forgotPassword = exports.login = exports.register = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const crypto_1 = __importDefault(require("crypto"));
const models_1 = require("../models");
const jwt_1 = require("../utils/jwt");
const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        if (!name || !email || !password) {
            res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
            return;
        }
        const existingUser = await models_1.User.findOne({ where: { email } });
        if (existingUser) {
            res.status(409).json({ message: 'Ya existe un usuario con ese email' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const newUser = await models_1.User.create({
            name,
            email,
            password: hashedPassword,
            role: 'user',
        });
        const token = (0, jwt_1.generateToken)({ id: newUser.id, role: newUser.role });
        res.status(201).json({
            message: 'Usuario registrado correctamente',
            token,
            user: {
                id: newUser.id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar el usuario' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            res.status(400).json({ message: 'Email y contraseña son obligatorios' });
            return;
        }
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ message: 'Credenciales inválidas' });
            return;
        }
        const token = (0, jwt_1.generateToken)({ id: user.id, role: user.role });
        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role,
                bio: user.bio,
                avatar: user.avatar,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al iniciar sesión' });
    }
};
exports.login = login;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            res.status(400).json({ message: 'El email es obligatorio' });
            return;
        }
        const user = await models_1.User.findOne({ where: { email } });
        if (!user) {
            res.status(200).json({
                message: 'Si el email existe, se generó un token de recuperación',
            });
            return;
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutos
        user.resetToken = token;
        user.resetTokenExpiry = expiry;
        await user.save();
        res.status(200).json({
            message: 'Token de recuperación generado (simulación de email)',
            resetToken: token,
            expiresInMinutes: 15,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al generar el token de recuperación' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            res.status(400).json({ message: 'Token y nueva contraseña son obligatorios' });
            return;
        }
        if (newPassword.length < 6) {
            res.status(400).json({ message: 'La contraseña debe tener al menos 6 caracteres' });
            return;
        }
        const user = await models_1.User.findOne({ where: { resetToken: token } });
        if (!user || !user.resetTokenExpiry || user.resetTokenExpiry < new Date()) {
            res.status(400).json({ message: 'Token inválido o expirado' });
            return;
        }
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        user.password = hashedPassword;
        user.resetToken = null;
        user.resetTokenExpiry = null;
        await user.save();
        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al restablecer la contraseña' });
    }
};
exports.resetPassword = resetPassword;
