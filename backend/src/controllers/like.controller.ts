import { Request, Response } from 'express';
import { Like } from '../models';

export const likePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.postId);

    if (isNaN(postId)) {
      res.status(400).json({ message: 'El postId debe ser un número válido' });
      return;
    }

    const userId = req.user!.id;

    const existing = await Like.findOne({ where: { postId, userId } });
    if (existing) {
      res.status(400).json({ message: 'Ya diste like a esta publicación' });
      return;
    }

    await Like.create({ postId, userId });
    const likesCount = await Like.count({ where: { postId } });

    res.status(201).json({ message: 'Like agregado', likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al dar like' });
  }
};

export const unlikePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.postId);

    if (isNaN(postId)) {
      res.status(400).json({ message: 'El postId debe ser un número válido' });
      return;
    }

    const userId = req.user!.id;

    const like = await Like.findOne({ where: { postId, userId } });
    if (!like) {
      res.status(404).json({ message: 'No has dado like a esta publicación' });
      return;
    }

    await like.destroy();
    const likesCount = await Like.count({ where: { postId } });

    res.status(200).json({ message: 'Like eliminado', likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al quitar like' });
  }
};

export const getLikesCount = async (req: Request, res: Response): Promise<void> => {
  try {
    const postId = Number(req.params.postId);

    if (isNaN(postId)) {
      res.status(400).json({ message: 'El postId debe ser un número válido' });
      return;
    }

    const likesCount = await Like.count({ where: { postId } });
    res.status(200).json({ postId, likesCount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al contar los likes' });
  }
};