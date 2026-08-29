import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import postRoutes from './routes/post.routes';
import followRoutes from './routes/follow.routes';
import likeRoutes from './routes/like.routes';
import commentRoutes from './routes/comment.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de Red Social funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/posts', postRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/likes', likeRoutes);
app.use('/api/follow', followRoutes);

export default app;