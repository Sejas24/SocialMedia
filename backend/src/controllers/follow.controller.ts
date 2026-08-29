import { Request, Response } from 'express';
import { Follow, User } from '../models';

export const followUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const followingId = Number(req.params.userId);

    if (isNaN(followingId)) {
      res.status(400).json({ message: 'El userId debe ser un número válido' });
      return;
    }

    const followerId = req.user!.id;

    if (followingId === followerId) {
      res.status(400).json({ message: 'No puedes seguirte a ti mismo' });
      return;
    }

    const existing = await Follow.findOne({ where: { followerId, followingId } });
    if (existing) {
      res.status(400).json({ message: 'Ya sigues a este usuario' });
      return;
    }

    await Follow.create({ followerId, followingId });
    res.status(201).json({ message: 'Ahora sigues a este usuario' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al seguir al usuario' });
  }
};

export const unfollowUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const followingId = Number(req.params.userId);

    if (isNaN(followingId)) {
      res.status(400).json({ message: 'El userId debe ser un número válido' });
      return;
    }

    const followerId = req.user!.id;

    const follow = await Follow.findOne({ where: { followerId, followingId } });
    if (!follow) {
      res.status(404).json({ message: 'No sigues a este usuario' });
      return;
    }

    await follow.destroy();
    res.status(200).json({ message: 'Dejaste de seguir a este usuario' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al dejar de seguir al usuario' });
  }
};

export const getFollowers = async (req: Request, res: Response): Promise<void> => {
  try {
    const followingId = Number(req.params.userId);

    if (isNaN(followingId)) {
      res.status(400).json({ message: 'El userId debe ser un número válido' });
      return;
    }

    const followers = await Follow.findAll({
      where: { followingId },
      include: [{ model: User, as: 'follower', attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(200).json({ followers });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los seguidores' });
  }
};

export const getFollowing = async (req: Request, res: Response): Promise<void> => {
  try {
    const followerId = Number(req.params.userId);

    if (isNaN(followerId)) {
      res.status(400).json({ message: 'El userId debe ser un número válido' });
      return;
    }

    const following = await Follow.findAll({
      where: { followerId },
      include: [{ model: User, as: 'followed', attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(200).json({ following });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener los usuarios seguidos' });
  }
};