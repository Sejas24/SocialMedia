import { Router } from 'express';
import { followUser, unfollowUser, getFollowers, getFollowing } from '../controllers/follow.controller';
import { verifyToken } from '../middlewares/auth.middleware';

const router = Router();

router.use(verifyToken);

router.post('/:userId', followUser);
router.delete('/:userId', unfollowUser);
router.get('/:userId/followers', getFollowers);
router.get('/:userId/following', getFollowing);

export default router;