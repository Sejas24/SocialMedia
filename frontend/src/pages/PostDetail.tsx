import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

import type { Post } from '../types';

import { getPostByIdRequest } from '../services/post.service';

import LikeButton from '../components/LikeButton';
import Comments from '../components/Comments';

const PostDetail = () => {
  const { id } = useParams();

  const [post, setPost] =
    useState<Post | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    const loadPost = async () => {
      if (!id) return;

      setLoading(true);
      setError(null);

      try {
        const { data } =
          await getPostByIdRequest(
            Number(id)
          );

        setPost(data);
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err.response
        ) {
          setError(
            err.response.data.message ||
            'No se pudo cargar la publicación'
          );
        } else {
          setError(
            'Error de conexión con el servidor'
          );
        }
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [id]);

  if (loading) {
    return (
      <p className="loading-state">
        Cargando publicación...
      </p>
    );
  }

  if (error) {
    return (
      <p className="error-text">
        {error}
      </p>
    );
  }

  if (!post) {
    return (
      <p className="empty-state">
        Publicación no encontrada.
      </p>
    );
  }

  return (
    <div className="post-detail">
      <article className="post-card">
        <div className="post-header">
          <Link
            to={`/profile/${post.User.id}`}
            className="avatar-ring avatar-md"
          >
            {post.User.avatar ? (
              <img
                src={post.User.avatar}
                alt={post.User.name}
              />
            ) : (
              <span>👤</span>
            )}
          </Link>

          <div className="post-author-info">
            <Link
              to={`/profile/${post.User.id}`}
              className="post-author-name"
            >
              {post.User.name}
            </Link>

            <span className="post-date">
              {new Date(
                post.createdAt
              ).toLocaleString()}
            </span>
          </div>
        </div>

        <p className="post-content">
          {post.content}
        </p>

        {post.image && (
          <img
            src={post.image}
            alt=""
            className="post-image"
          />
        )}

        <div className="post-stats">
          <LikeButton
            postId={post.id}
            initialLikes={post.likesCount}
            initialLiked={
              post.likedByCurrentUser ?? false
            }
          />
        </div>
      </article>

      <Comments postId={post.id} />
    </div>
  );
};

export default PostDetail;