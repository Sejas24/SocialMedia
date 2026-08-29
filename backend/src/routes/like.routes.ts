import { Router } from 'express';
import { likePost, unlikePost, getLikesCount } from '../controllers/like.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

router.post('/:postId', likePost);
router.delete('/:postId', unlikePost);
router.get('/:postId', getLikesCount);

export default router;