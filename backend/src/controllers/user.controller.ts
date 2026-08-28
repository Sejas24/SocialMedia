import { Request, Response } from 'express';
import { User } from '../models';

export const getMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = await User.findByPk(req.user!.id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el perfil' });
  }
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, bio, avatar } = req.body;

    const user = await User.findByPk(req.user!.id);
    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    user.name = name ?? user.name;
    user.bio = bio ?? user.bio;
    user.avatar = avatar ?? user.avatar;

    await user.save();

    const { password, ...userWithoutPassword } = user.toJSON();

    res.status(200).json({
      message: 'Perfil actualizado correctamente',
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al actualizar el perfil' });
  }
};

export const getUserById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'El id debe ser un número válido' });
      return;
    }

    const user = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
    });

    if (!user) {
      res.status(404).json({ message: 'Usuario no encontrado' });
      return;
    }

    res.status(200).json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el usuario' });
  }
};

export const getAllUsers = async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ['password'] },
      order: [['createdAt', 'DESC']],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al listar los usuarios' });
  }
};