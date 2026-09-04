"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLikesCount = exports.unlikePost = exports.likePost = void 0;
const models_1 = require("../models");
const likePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: 'El postId debe ser un número válido' });
            return;
        }
        const userId = req.user.id;
        const existing = await models_1.Like.findOne({ where: { postId, userId } });
        if (existing) {
            res.status(400).json({ message: 'Ya diste like a esta publicación' });
            return;
        }
        await models_1.Like.create({ postId, userId });
        const likesCount = await models_1.Like.count({ where: { postId } });
        res.status(201).json({ message: 'Like agregado', likesCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al dar like' });
    }
};
exports.likePost = likePost;
const unlikePost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: 'El postId debe ser un número válido' });
            return;
        }
        const userId = req.user.id;
        const like = await models_1.Like.findOne({ where: { postId, userId } });
        if (!like) {
            res.status(404).json({ message: 'No has dado like a esta publicación' });
            return;
        }
        await like.destroy();
        const likesCount = await models_1.Like.count({ where: { postId } });
        res.status(200).json({ message: 'Like eliminado', likesCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al quitar like' });
    }
};
exports.unlikePost = unlikePost;
const getLikesCount = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: 'El postId debe ser un número válido' });
            return;
        }
        const likesCount = await models_1.Like.count({ where: { postId } });
        res.status(200).json({ postId, likesCount });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al contar los likes' });
    }
};
exports.getLikesCount = getLikesCount;
