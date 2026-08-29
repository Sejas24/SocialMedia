import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { darLike, quitarLike, contarLikes } from '../controllers/like.controller';

const router = Router();

router.post('/:postId', verificarToken, darLike);
router.delete('/:postId', verificarToken, quitarLike);
router.get('/:postId', verificarToken, contarLikes);

export default router;