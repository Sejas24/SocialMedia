import { useEffect, useState } from 'react';
import {
  followUserRequest,
  unfollowUserRequest,
  getFollowersRequest,
} from '../services/follow.service';
import { useAuth } from '../context/AuthContext';

interface Props {
  userId: number;
}

export default function FollowButton({ userId }: Props) {
  const { user } = useAuth();

  const [isFollowing, setIsFollowing] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadFollowingStatus = async () => {
      if (!user || user.id === userId) return;

      try {
        const { data } = await getFollowersRequest(userId);

        setIsFollowing(
          data.followers.some(
            (item) => item.follower.id === user.id
          )
        );
      } catch (error) {
        console.error(error);
      }
    };

    loadFollowingStatus();
  }, [user, userId]);

  if (!user || user.id === userId) {
    return null;
  }

  const handleFollow = async () => {
    try {
      setLoading(true);

      if (isFollowing) {
        await unfollowUserRequest(userId);
        setIsFollowing(false);
      } else {
        await followUserRequest(userId);
        setIsFollowing(true);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleFollow}
      disabled={loading}
      className="follow-button"
    >
      {loading
        ? '...'
        : isFollowing
        ? 'Dejar de seguir'
        : 'Seguir'}
    </button>
  );
}