import { Router } from 'express';
import { getMe, updateMe, getUserById, getAllUsers } from '../controllers/user.controller';
import { verifyToken } from '../middlewares/auth.middleware';
import { checkRole } from '../middlewares/role.middleware';

const router = Router();

router.use(verifyToken);

router.get('/me', getMe);
router.put('/me', updateMe);
router.get('/', checkRole('admin'), getAllUsers);
router.get('/:id', getUserById);

export default router;