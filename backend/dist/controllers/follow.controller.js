"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getFollowing = exports.getFollowers = exports.unfollowUser = exports.followUser = void 0;
const models_1 = require("../models");
const followUser = async (req, res) => {
    try {
        const followingId = Number(req.params.userId);
        if (isNaN(followingId)) {
            res.status(400).json({ message: 'El userId debe ser un número válido' });
            return;
        }
        const followerId = req.user.id;
        if (followingId === followerId) {
            res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
            return;
        }
        const existing = await models_1.Follow.findOne({ where: { followerId, followingId } });
        if (existing) {
            res.status(400).json({ message: 'Ya sigues a este usuario' });
            return;
        }
        await models_1.Follow.create({ followerId, followingId });
        res.status(201).json({ message: 'Ahora sigues a este usuario' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al seguir al usuario' });
    }
};
exports.followUser = followUser;
const unfollowUser = async (req, res) => {
    try {
        const followingId = Number(req.params.userId);
        if (isNaN(followingId)) {
            res.status(400).json({ message: 'El userId debe ser un número válido' });
            return;
        }
        const followerId = req.user.id;
        const follow = await models_1.Follow.findOne({ where: { followerId, followingId } });
        if (!follow) {
            res.status(404).json({ message: 'No sigues a este usuario' });
            return;
        }
        await follow.destroy();
        res.status(200).json({ message: 'Dejaste de seguir a este usuario' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al dejar de seguir al usuario' });
    }
};
exports.unfollowUser = unfollowUser;
const getFollowers = async (req, res) => {
    try {
        const followingId = Number(req.params.userId);
        if (isNaN(followingId)) {
            res.status(400).json({ message: 'El userId debe ser un número válido' });
            return;
        }
        const followers = await models_1.Follow.findAll({
            where: { followingId },
            include: [{ model: models_1.User, as: 'follower', attributes: ['id', 'name', 'avatar'] }],
        });
        res.status(200).json({ followers });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los seguidores' });
    }
};
exports.getFollowers = getFollowers;
const getFollowing = async (req, res) => {
    try {
        const followerId = Number(req.params.userId);
        if (isNaN(followerId)) {
            res.status(400).json({ message: 'El userId debe ser un número válido' });
            return;
        }
        const following = await models_1.Follow.findAll({
            where: { followerId },
            include: [{ model: models_1.User, as: 'followed', attributes: ['id', 'name', 'avatar'] }],
        });
        res.status(200).json({ following });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios seguidos' });
    }
};
exports.getFollowing = getFollowing;
