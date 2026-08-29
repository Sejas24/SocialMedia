import { Request, Response } from 'express';
import { Post, Comment, User, Like } from '../models';

export const createComment = async (req: Request, res: Response): Promise<void> => {
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

    const comment = await Comment.create({
      content,
      userId: req.user!.id,
      postId,
    });

    const commentWithAuthor = await Comment.findByPk(comment.id, {
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(201).json({
      message: 'Comentario creado correctamente',
      comment: commentWithAuthor,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear el comentario' });
  }
};

export const getCommentsByPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.postId);

    if (isNaN(postId)) {
      res.status(400).json({ message: 'El postId debe ser un número válido' });
      return;
    }

    const comments = await Comment.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'ASC']],
    });

    res.status(200).json({ comments });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los comentarios' });
  }
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'El id debe ser un número válido' });
      return;
    }

    const comment = await Comment.findByPk(id);
    if (!comment) {
      res.status(404).json({ message: 'Comentario no encontrado' });
      return;
    }

    const isOwner = comment.userId === req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'No tienes permiso para eliminar este comentario' });
      return;
    }

    await comment.destroy();
    res.status(200).json({ message: 'Comentario eliminado correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar el comentario' });
  }
};