import { useEffect, useState } from 'react';
import {
  getFollowersRequest,
  getFollowingRequest,
} from '../services/follow.service';

interface Props {
  userId: number;
}

export default function FollowStats({ userId }: Props) {
  const [followers, setFollowers] = useState(0);
  const [following, setFollowing] = useState(0);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const [followersResponse, followingResponse] = await Promise.all([
          getFollowersRequest(userId),
          getFollowingRequest(userId),
        ]);

        setFollowers(followersResponse.data.followers.length);
        setFollowing(followingResponse.data.following.length);
      } catch (error) {
        console.error(error);
      }
    };

    loadStats();
  }, [userId]);

  return (
    <div className="follow-stats">
      <span>
        <strong>{followers}</strong> seguidores
      </span>

      <span>
        <strong>{following}</strong> siguiendo
      </span>
    </div>
  );
}