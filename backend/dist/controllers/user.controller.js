"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllUsers = exports.getUserById = exports.updateMe = exports.getMe = void 0;
const models_1 = require("../models");
const getMe = async (req, res) => {
    try {
        const user = await models_1.User.findByPk(req.user.id, {
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
        });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el perfil' });
    }
};
exports.getMe = getMe;
const updateMe = async (req, res) => {
    try {
        const { name, bio, avatar } = req.body;
        const user = await models_1.User.findByPk(req.user.id);
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        user.name = name ?? user.name;
        user.bio = bio ?? user.bio;
        user.avatar = avatar ?? user.avatar;
        await user.save();
        const { password, ...userWithoutPassword } = user.toJSON();
        res.status(200).json({
            message: 'Perfil actualizado correctamente',
            user: userWithoutPassword,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al actualizar el perfil' });
    }
};
exports.updateMe = updateMe;
const getUserById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'El id debe ser un número válido' });
            return;
        }
        const user = await models_1.User.findByPk(id, {
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
        });
        if (!user) {
            res.status(404).json({ message: 'Usuario no encontrado' });
            return;
        }
        res.status(200).json(user);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el usuario' });
    }
};
exports.getUserById = getUserById;
const getAllUsers = async (req, res) => {
    try {
        const users = await models_1.User.findAll({
            attributes: { exclude: ['password', 'resetToken', 'resetTokenExpiry'] },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json(users);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al listar los usuarios' });
    }
};
exports.getAllUsers = getAllUsers;
