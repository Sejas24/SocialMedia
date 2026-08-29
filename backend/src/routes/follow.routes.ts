import { Router } from 'express';
import { verificarToken } from '../middlewares/auth.middleware';
import { seguirUsuario, dejarDeSeguir, listarSeguidores, listarSeguidos } from '../controllers/follow.controller';

const router = Router();

router.post('/:userId', verificarToken, seguirUsuario);
router.delete('/:userId', verificarToken, dejarDeSeguir);
router.get('/:userId/seguidores', verificarToken, listarSeguidores);
router.get('/:userId/seguidos', verificarToken, listarSeguidos);

export default router;