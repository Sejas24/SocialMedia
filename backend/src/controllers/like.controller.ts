import { Request, Response } from 'express';
import { Like } from '../models';

export const darLike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user.id;

    const existente = await Like.findOne({ where: { postId, userId } });
    if (existente) {
      return res.status(400).json({ error: 'Ya diste like a esta publicación' });
    }

    await Like.create({ postId, userId });
    const total = await Like.count({ where: { postId } });
    res.status(201).json({ mensaje: 'Like agregado', total });
  } catch (error) {
    res.status(500).json({ error: 'Error al dar like' });
  }
};

export const quitarLike = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const userId = (req as any).user.id;

    const like = await Like.findOne({ where: { postId, userId } });
    if (!like) return res.status(404).json({ error: 'No has dado like a esta publicación' });

    await like.destroy();
    const total = await Like.count({ where: { postId } });
    res.json({ mensaje: 'Like eliminado', total });
  } catch (error) {
    res.status(500).json({ error: 'Error al quitar like' });
  }
};

export const contarLikes = async (req: Request, res: Response) => {
  try {
    const { postId } = req.params;
    const total = await Like.count({ where: { postId } });
    res.json({ postId, total });
  } catch (error) {
    res.status(500).json({ error: 'Error al contar likes' });
  }
};