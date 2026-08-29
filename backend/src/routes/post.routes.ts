import { Router } from 'express';
import { createPost, getFeed, getPostById, deletePost } from '../controllers/post.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

router.post('/', createPost);
router.get('/', getFeed);
router.get('/:id', getPostById);
router.delete('/:id', deletePost);

export default router;