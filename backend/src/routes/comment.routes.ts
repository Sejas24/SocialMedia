import { Request, Response } from 'express';
import { Comment, User } from '../models';

export const crearComentario = async (req: Request, res: Response) => {
  try {
    const { contenido } = req.body;
    const { postId } = req.params;
    const userId = (req as any).usuario.id;

    if (!contenido) {
      return res.status(400).json({ error: 'El contenido es requerido' });
    }

    const comentario = await Comment.create({ contenido, userId, postId });
    res.status(201).json(comentario);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el comentario' });
  }
};

export const obtenerComentariosPorPost = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const comentarios = await Comment.findAll({
      where: { postId },
      include: [{ model: User, attributes: ['id', 'nombre'] }],
      order: [['createdAt', 'ASC']],
    });
    res.json(comentarios);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener comentarios' });
  }
};

export const eliminarComentario = async (req: Request, res: Response) => {
  try {
    const comentario = await Comment.findByPk(req.params.id);
    if (!comentario) return res.status(404).json({ error: 'Comentario no encontrado' });

    const userId = (req as any).usuario.id;
    const role = (req as any).usuario.role;

    if ((comentario as any).userId !== userId && role !== 'admin') {
      return res.status(403).json({ error: 'No autorizado' });
    }

    await comentario.destroy();
    res.json({ mensaje: 'Comentario eliminado' });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar comentario' });
  }
};