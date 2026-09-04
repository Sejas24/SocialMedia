import {
  useState,
  type SyntheticEvent,
} from 'react';

import axios from 'axios';

import { createCommentRequest } from '../services/comment.service';

import type { Comment } from '../types';

interface Props {
  postId: number;
  onCreated: (comment: Comment) => void;
}

const CommentForm = ({
  postId,
  onCreated,
}: Props) => {
  const [content, setContent] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!content.trim()) {
      setError(
        'Escribe un comentario'
      );
      return;
    }

    setError(null);
    setLoading(true);

    try {
      const { data } =
        await createCommentRequest(
          postId,
          content.trim()
        );

      onCreated(data.comment);

      setContent('');
    } catch (err) {
      if (
        axios.isAxiosError(err) &&
        err.response
      ) {
        setError(
          err.response.data.message ||
          'No se pudo crear el comentario'
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

  return (
    <form
      onSubmit={handleSubmit}
      className="comment-form"
    >
      <textarea
        className="input"
        value={content}
        onChange={(e) =>
          setContent(e.target.value)
        }
        placeholder="Escribe un comentario..."
        rows={3}
      />

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn btn-primary"
      >
        {loading
          ? 'Comentando...'
          : 'Comentar'}
      </button>
    </form>
  );
};

export default CommentForm;