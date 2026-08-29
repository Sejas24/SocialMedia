import { Router } from 'express';
import { createComment, getCommentsByPost, deleteComment } from '../controllers/comment.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

router.post('/:postId', createComment);
router.get('/:postId', getCommentsByPost);
router.delete('/:id', deleteComment);

export default router;