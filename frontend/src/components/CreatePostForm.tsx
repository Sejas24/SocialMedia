import { useState, type SyntheticEvent } from 'react';
import { createPostRequest } from '../services/post.service';
import type { Post } from '../types';
import axios from 'axios';

interface Props {
  onCreated: (post: Post) => void;
}

const CreatePostForm = ({ onCreated }: Props) => {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!content.trim()) {
      setError('Escribe algo antes de publicar');
      return;
    }

    setLoading(true);
    try {
      const { data } = await createPostRequest({ content, image: image.trim() || undefined });
      onCreated(data.post);
      setContent('');
      setImage('');
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(err.response.data.message || 'Error al publicar');
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="create-post">
      <textarea
        className="input"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="¿Qué estás pensando?"
      />
      <input
        type="url"
        className="input"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="URL de una imagen (opcional)"
      />
      {error && <p className="error-text">{error}</p>}
      <button type="submit" disabled={loading} className="btn btn-primary">
        {loading ? 'Publicando...' : 'Publicar'}
      </button>
    </form>
  );
};

export default CreatePostForm;