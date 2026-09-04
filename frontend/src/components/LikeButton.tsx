import { useState } from 'react';
import axios from 'axios';

import {
  likePostRequest,
  unlikePostRequest,
} from '../services/like.service';

interface Props {
  postId: number;
  initialLikes: number;
  initialLiked: boolean;
}

const LikeButton = ({
  postId,
  initialLikes,
  initialLiked,
}: Props) => {
  const [liked, setLiked] = useState(initialLiked);
  const [likesCount, setLikesCount] =
    useState(initialLikes);

  const [loading, setLoading] = useState(false);

  const handleLike = async () => {
    if (loading) return;

    setLoading(true);

    try {
      if (liked) {
        const { data } =
          await unlikePostRequest(postId);

        setLiked(false);
        setLikesCount(data.likesCount);
      } else {
        const { data } =
          await likePostRequest(postId);

        setLiked(true);
        setLikesCount(data.likesCount);
      }
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response
      ) {
        alert(
          err.response.data.message ||
          'No se pudo actualizar el like'
        );
      } else {
        alert(
          'Error de conexión con el servidor'
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLike}
      disabled={loading}
      className="like-button"
      aria-label={
        liked
          ? 'Quitar like'
          : 'Dar like'
      }
    >
      {liked ? '❤️' : '🤍'} {likesCount} likes
    </button>
  );
};

export default LikeButton;