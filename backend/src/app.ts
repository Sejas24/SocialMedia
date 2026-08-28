import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';

const app: Application = express();

app.use(cors());
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'API de Red Social funcionando correctamente' });
});

app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

export default app;