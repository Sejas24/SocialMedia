import { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

import type { Comment } from '../types';

import {
  getCommentsRequest,
  deleteCommentRequest,
} from '../services/comment.service';

import CommentForm from './CommentForm';

import { useAuth } from '../context/AuthContext';

interface Props {
  postId: number;
}

const Comments = ({
  postId,
}: Props) => {
  const { user } = useAuth();

  const [comments, setComments] =
    useState<Comment[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadComments = async () => {
    setLoading(true);
    setError(null);

    try {
      const { data } =
        await getCommentsRequest(postId);

      setComments(data.comments);
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response
      ) {
        setError(
          err.response.data.message ||
          'No se pudieron cargar los comentarios'
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

  useEffect(() => {
    loadComments();
  }, [postId]);

  const handleCreated = (
    comment: Comment
  ) => {
    setComments((prev) => [
      ...prev,
      comment,
    ]);
  };

  const handleDelete = async (
    commentId: number
  ) => {
    if (
      !confirm(
        '¿Eliminar este comentario?'
      )
    ) {
      return;
    }

    try {
      await deleteCommentRequest(
        commentId
      );

      setComments((prev) =>
        prev.filter(
          (comment) =>
            comment.id !== commentId
        )
      );
    } catch {
      alert(
        'No se pudo eliminar el comentario'
      );
    }
  };

  return (
    <section className="comments-section">
      <h2>Comentarios</h2>

      <CommentForm
        postId={postId}
        onCreated={handleCreated}
      />

      {loading && (
        <p className="loading-state">
          Cargando comentarios...
        </p>
      )}

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      {!loading &&
        !error &&
        comments.length === 0 && (
          <p className="empty-state">
            Todavía no hay comentarios.
          </p>
        )}

      <div className="comments-list">
        {comments.map((comment) => {
          const canDelete =
            user?.id === comment.userId ||
            user?.role === 'admin';

          return (
            <article
              key={comment.id}
              className="comment"
            >
              <Link
                to={`/profile/${comment.User.id}`}
                className="comment-author"
              >
                {comment.User.name}
              </Link>

              <p className="comment-content">
                {comment.content}
              </p>

              {canDelete && (
                <button
                  type="button"
                  className="comment-delete"
                  onClick={() =>
                    handleDelete(
                      comment.id
                    )
                  }
                >
                  Eliminar
                </button>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default Comments;