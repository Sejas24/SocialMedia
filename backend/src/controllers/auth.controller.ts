import { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models';
import { generateToken } from '../utils/jwt';

export const register = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400).json({ message: 'Nombre, email y contraseña son obligatorios' });
      return;
    }

    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      res.status(409).json({ message: 'Ya existe un usuario con ese email' });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken({ id: newUser.id, role: newUser.role });

    res.status(201).json({
      message: 'Usuario registrado correctamente',
      token,
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al registrar el usuario' });
  }
};

export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400).json({ message: 'Email y contraseña son obligatorios' });
      return;
    }

    const user = await User.findOne({ where: { email } });
    if (!user) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      res.status(401).json({ message: 'Credenciales inválidas' });
      return;
    }

    const token = generateToken({ id: user.id, role: user.role });

    res.status(200).json({
      message: 'Inicio de sesión exitoso',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        bio: user.bio,
        avatar: user.avatar,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al iniciar sesión' });
  }
};