import { Request, Response } from 'express';
import { Follow, User } from '../models';

export const seguirUsuario = async (req: Request, res: Response) => {
  try {
    const followerId = (req as any).user.id;
    const { userId: followingId } = req.params;

    if (Number(followingId) === followerId) {
      return res.status(400).json({ error: 'No puedes seguirte a ti mismo' });
    }

    const existente = await Follow.findOne({ where: { followerId, followingId } });
    if (existente) return res.status(400).json({ error: 'Ya sigues a este usuario' });

    await Follow.create({ followerId, followingId });
    res.status(201).json({ mensaje: 'Ahora sigues a este usuario' });
  } catch (error) {
    res.status(500).json({ error: 'Error al seguir usuario' });
  }
};

export const dejarDeSeguir = async (req: Request, res: Response) => {
  try {
    const followerId = (req as any).user.id;
    const { userId: followingId } = req.params;

    const follow = await Follow.findOne({ where: { followerId, followingId } });
    if (!follow) return res.status(404).json({ error: 'No sigues a este usuario' });

    await follow.destroy();
    res.json({ mensaje: 'Dejaste de seguir a este usuario' });
  } catch (error) {
    res.status(500).json({ error: 'Error al dejar de seguir' });
  }
};

export const listarSeguidores = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const seguidores = await Follow.findAll({
      where: { followingId: userId },
      include: [{ model: User, as: 'follower', attributes: ['id', 'nombre'] }],
    });
    res.json(seguidores);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar seguidores' });
  }
};

export const listarSeguidos = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const seguidos = await Follow.findAll({
      where: { followerId: userId },
      include: [{ model: User, as: 'followed', attributes: ['id', 'nombre'] }],
    });
    res.json(seguidos);
  } catch (error) {
    res.status(500).json({ error: 'Error al listar seguidos' });
  }
};