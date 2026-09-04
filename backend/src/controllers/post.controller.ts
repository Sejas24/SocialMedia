import { Request, Response } from 'express';
import { Post, User, Like, Comment } from '../models';

export const createPost = async (req: Request, res: Response): Promise<void> => {
  try {
    const { content, image } = req.body;

    if (!content || content.trim() === '') {
      res.status(400).json({ message: 'El contenido de la publicación es obligatorio' });
      return;
    }

    const post = await Post.create({
      content,
      image: image ?? null,
      userId: req.user!.id,
    });

    const postWithAuthor = await Post.findByPk(post.id, {
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
    });

    res.status(201).json({
      message: 'Publicación creada correctamente',
      post: {
        ...postWithAuthor!.toJSON(),
        likesCount: 0,
        commentsCount: 0,
        likedByCurrentUser: false,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al crear la publicación' });
  }
};

export const getFeed = async (req: Request, res: Response): Promise<void> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = (page - 1) * limit;

    const { rows: posts, count: total } = await Post.findAndCountAll({
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
      order: [['createdAt', 'DESC']],
      limit,
      offset,
    });

    const postsWithCounts = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.count({ where: { postId: post.id } });
        const commentsCount = await Comment.count({ where: { postId: post.id } });
        const userLike = await Like.findOne({
          where: {
            postId: post.id,
            userId: req.user!.id,
          },
        });

        return {
          ...post.toJSON(),
          likesCount,
          commentsCount,
          likedByCurrentUser: !!userLike,
        };
      })
    );

    res.status(200).json({
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      posts: postsWithCounts,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener el feed' });
  }
};

export const getPostsByUser = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const userId = Number(req.params.userId);

    if (isNaN(userId)) {
      res.status(400).json({
        message: 'El userId debe ser un número válido',
      });
      return;
    }

    const posts = await Post.findAll({
      where: { userId },
      include: [
        {
          model: User,
          attributes: ['id', 'name', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    const postsWithData = await Promise.all(
      posts.map(async (post) => {
        const likesCount = await Like.count({
          where: { postId: post.id },
        });

        const commentsCount = await Comment.count({
          where: { postId: post.id },
        });

        const userLike = await Like.findOne({
          where: {
            postId: post.id,
            userId: req.user!.id,
          },
        });

        return {
          ...post.toJSON(),
          likesCount,
          commentsCount,
          likedByCurrentUser: !!userLike,
        };
      })
    );

    res.status(200).json({
      posts: postsWithData,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: 'Error al obtener las publicaciones del usuario',
    });
  }
};

export const getPostById = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'El id debe ser un número válido' });
      return;
    }

    const post = await Post.findByPk(id, {
      include: [{ model: User, attributes: ['id', 'name', 'avatar'] }],
    });

    if (!post) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    const likesCount = await Like.count({ where: { postId: post.id } });
    const commentsCount = await Comment.count({ where: { postId: post.id } });
    const userLike = await Like.findOne({
      where: {
        postId: post.id,
        userId: req.user!.id,
      },
    });

    res.status(200).json({
      ...post.toJSON(),
      likesCount,
      commentsCount,
      likedByCurrentUser: !!userLike,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al obtener la publicación' });
  }
};

export const deletePost = async (req: Request, res: Response): Promise<void> => {
  try {
    const id = Number(req.params.id);

    if (isNaN(id)) {
      res.status(400).json({ message: 'El id debe ser un número válido' });
      return;
    }

    const post = await Post.findByPk(id);
    if (!post) {
      res.status(404).json({ message: 'Publicación no encontrada' });
      return;
    }

    const isOwner = post.userId === req.user!.id;
    const isAdmin = req.user!.role === 'admin';

    if (!isOwner && !isAdmin) {
      res.status(403).json({ message: 'No tienes permiso para eliminar esta publicación' });
      return;
    }

    await post.destroy();

    res.status(200).json({ message: 'Publicación eliminada correctamente' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error al eliminar la publicación' });
  }
};