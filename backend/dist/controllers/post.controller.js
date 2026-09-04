"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePost = exports.getPostById = exports.getPostsByUser = exports.getFeed = exports.createPost = void 0;
const models_1 = require("../models");
const createPost = async (req, res) => {
    try {
        const { content, image } = req.body;
        if (!content || content.trim() === '') {
            res.status(400).json({ message: 'El contenido de la publicación es obligatorio' });
            return;
        }
        const post = await models_1.Post.create({
            content,
            image: image ?? null,
            userId: req.user.id,
        });
        const postWithAuthor = await models_1.Post.findByPk(post.id, {
            include: [{ model: models_1.User, attributes: ['id', 'name', 'avatar'] }],
        });
        res.status(201).json({
            message: 'Publicación creada correctamente',
            post: {
                ...postWithAuthor.toJSON(),
                likesCount: 0,
                commentsCount: 0,
                likedByCurrentUser: false,
            },
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la publicación' });
    }
};
exports.createPost = createPost;
const getFeed = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const offset = (page - 1) * limit;
        const { rows: posts, count: total } = await models_1.Post.findAndCountAll({
            include: [{ model: models_1.User, attributes: ['id', 'name', 'avatar'] }],
            order: [['createdAt', 'DESC']],
            limit,
            offset,
        });
        const postsWithCounts = await Promise.all(posts.map(async (post) => {
            const likesCount = await models_1.Like.count({ where: { postId: post.id } });
            const commentsCount = await models_1.Comment.count({ where: { postId: post.id } });
            const userLike = await models_1.Like.findOne({
                where: {
                    postId: post.id,
                    userId: req.user.id,
                },
            });
            return {
                ...post.toJSON(),
                likesCount,
                commentsCount,
                likedByCurrentUser: !!userLike,
            };
        }));
        res.status(200).json({
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            posts: postsWithCounts,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener el feed' });
    }
};
exports.getFeed = getFeed;
const getPostsByUser = async (req, res) => {
    try {
        const userId = Number(req.params.userId);
        if (isNaN(userId)) {
            res.status(400).json({
                message: 'El userId debe ser un número válido',
            });
            return;
        }
        const posts = await models_1.Post.findAll({
            where: { userId },
            include: [
                {
                    model: models_1.User,
                    attributes: ['id', 'name', 'avatar'],
                },
            ],
            order: [['createdAt', 'DESC']],
        });
        const postsWithData = await Promise.all(posts.map(async (post) => {
            const likesCount = await models_1.Like.count({
                where: { postId: post.id },
            });
            const commentsCount = await models_1.Comment.count({
                where: { postId: post.id },
            });
            const userLike = await models_1.Like.findOne({
                where: {
                    postId: post.id,
                    userId: req.user.id,
                },
            });
            return {
                ...post.toJSON(),
                likesCount,
                commentsCount,
                likedByCurrentUser: !!userLike,
            };
        }));
        res.status(200).json({
            posts: postsWithData,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error al obtener las publicaciones del usuario',
        });
    }
};
exports.getPostsByUser = getPostsByUser;
const getPostById = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'El id debe ser un número válido' });
            return;
        }
        const post = await models_1.Post.findByPk(id, {
            include: [{ model: models_1.User, attributes: ['id', 'name', 'avatar'] }],
        });
        if (!post) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        const likesCount = await models_1.Like.count({ where: { postId: post.id } });
        const commentsCount = await models_1.Comment.count({ where: { postId: post.id } });
        const userLike = await models_1.Like.findOne({
            where: {
                postId: post.id,
                userId: req.user.id,
            },
        });
        res.status(200).json({
            ...post.toJSON(),
            likesCount,
            commentsCount,
            likedByCurrentUser: !!userLike,
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener la publicación' });
    }
};
exports.getPostById = getPostById;
const deletePost = async (req, res) => {
    try {
        const id = Number(req.params.id);
        if (isNaN(id)) {
            res.status(400).json({ message: 'El id debe ser un número válido' });
            return;
        }
        const post = await models_1.Post.findByPk(id);
        if (!post) {
            res.status(404).json({ message: 'Publicación no encontrada' });
            return;
        }
        const isOwner = post.userId === req.user.id;
        const isAdmin = req.user.role === 'admin';
        if (!isOwner && !isAdmin) {
            res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
            return;
        }
        await post.destroy();
        res.status(200).json({ message: 'Publicación eliminada correctamente' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al eliminar la publicación' });
    }
};
exports.deletePost = deletePost;
