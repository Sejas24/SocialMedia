import { Link } from 'react-router-dom';
import type { Post } from '../types';
import { formatRelativeDate } from '../utils/formatDate';
import { useAuth } from '../context/AuthContext';
import LikeButton from './LikeButton';

interface Props {
  post: Post;
  onDelete?: (id: number) => void;
}

const PostCard = ({ post, onDelete }: Props) => {
  const { user } = useAuth();
  const canDelete = user?.id === post.User.id || user?.role === 'admin';

  return (
    <article className="post-card">
      <div className="post-header">
        <Link to={`/profile/${post.User.id}`} className="avatar-ring avatar-md">
          <img
            src={post.User.avatar}
            alt={post.User.name}
          />
        </Link>

        <div className="post-author-info">
          <Link to={`/profile/${post.User.id}`} className="post-author-name">
            {post.User.name}
          </Link>
          <span className="post-date">{formatRelativeDate(post.createdAt)}</span>
        </div>

        {canDelete && onDelete && (
          <button onClick={() => onDelete(post.id)} className="post-delete">
            Eliminar
          </button>
        )}
      </div>

      <p className="post-content">{post.content}</p>

      {post.image && <img src={post.image} alt="" className="post-image" />}

      <div className="post-stats">
  <LikeButton
    postId={post.id}
    initialLikes={post.likesCount}
    initialLiked={
      post.likedByCurrentUser ?? false
    }
  />

  <Link to={`/posts/${post.id}`}>
    💬 {post.commentsCount} comentarios
  </Link>
</div>
    </article>
  );
};

export default PostCard;