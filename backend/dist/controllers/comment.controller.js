"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteComment = exports.getCommentsByPost = exports.createComment = void 0;
const models_1 = require("../models");
const createComment = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        const { content } = req.body;
        if (isNaN(postId)) {
            res.status(400).json({ message: 'El postId debe ser un número válido' });
            return;
        }
        if (!content || content.trim() === '') {
            res.status(400).json({ message: 'El contenido del comentario es obligatorio' });
            return;
        }
        const comment = await models_1.Comment.create({
            content,
            userId: req.user.id,
            postId,
        });
        const commentWithAuthor = await models_1.Comment.findByPk(comment.id, {
            include: [{ model: models_1.User, attributes: ['id', 'name', 'avatar'] }],
        });
        res.status(201).json({
            message: 'Comentario creado correctamente',
            comment: commentWithAuthor,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear el comentario' });
    }
};
exports.createComment = createComment;
const getCommentsByPost = async (req, res) => {
    try {
        const postId = Number(req.params.postId);
        if (isNaN(postId)) {
            res.status(400).json({ message: 'El postId debe ser un número válido' });
            return;
        }
        const comments = await models_1.Comment.findAll({
            where: { postId },
            include: [{ model: models_1.User, attributes: ['id', 'name', 'avatar'] }],
            order: [['createdAt', 'ASC']],
        });
        res.status(200).json({ comments });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los comentarios' });
    }
};
exports.getCommentsByPost = getCommentsByPost;
const deleteComment = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'El id debe ser un número válido' });
            return;
        }
        const comment = await models_1.Comment.findByPk(id);
        if (!comment) {
            res.status(404).json({ message: 'Comentario no encontrado' });
            return;
        }
        const isOwner = comment.userId === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
            return;
        }
        await comment.destroy();
        res.status(200).json({ message: 'Comentario eliminado correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar el comentario' });
    }
};
exports.deleteComment = deleteComment;
