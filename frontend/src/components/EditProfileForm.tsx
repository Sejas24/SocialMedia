import { useState, type SyntheticEvent } from 'react';
import axios from 'axios';

import type { User } from '../types';
import { updateMeRequest } from '../services/user.service';

interface Props {
  user: User;
  onUpdated: (user: User) => void;
  onCancel: () => void;
}

const EditProfileForm = ({
  user,
  onUpdated,
  onCancel,
}: Props) => {
  const [name, setName] = useState(user.name);
  const [bio, setBio] = useState(user.bio ?? '');
  const [avatar, setAvatar] = useState(user.avatar ?? '');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (
    e: SyntheticEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError(null);
    setLoading(true);

    try {
      const { data } = await updateMeRequest({
        name: name.trim(),
        bio: bio.trim(),
        avatar: avatar.trim(),
      });

      onUpdated(data.user);
    } catch (err) {
      if (axios.isAxiosError(err) && err.response) {
        setError(
          err.response.data.message ||
          'No se pudo actualizar el perfil'
        );
      } else {
        setError('Error de conexión con el servidor');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="edit-profile-form"
    >
      <div className="field">
        <label htmlFor="profile-name">
          Nombre
        </label>

        <input
          id="profile-name"
          type="text"
          className="input"
          value={name}
          onChange={(e) =>
            setName(e.target.value)
          }
          required
        />
      </div>

      <div className="field">
        <label htmlFor="profile-bio">
          Biografía
        </label>

        <textarea
          id="profile-bio"
          className="input"
          value={bio}
          onChange={(e) =>
            setBio(e.target.value)
          }
          rows={4}
          placeholder="Cuéntanos algo sobre ti..."
        />
      </div>

      <div className="form-group">
  <label htmlFor="avatar">Imagen de perfil</label>

  <input
    id="avatar"
    type="url"
    value={avatar}
    onChange={(e) => setAvatar(e.target.value)}
    placeholder="https://ejemplo.com/mi-foto.jpg"
  />
    {avatar && (
  <img
    src={avatar}
    alt="Vista previa"
    className="avatar-preview"
    onError={(e) => {
      e.currentTarget.src = '/default-avatar.png';
    }}
  />
)}
  <small>
    Coloca la URL de una imagen para usarla como foto de perfil.
  </small>
</div>

      {error && (
        <p className="error-text">
          {error}
        </p>
      )}

      <div className="profile-actions">
        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
        >
          {loading
            ? 'Guardando...'
            : 'Guardar cambios'}
        </button>

        <button
          type="button"
          className="btn btn-ghost"
          onClick={onCancel}
          disabled={loading}
        >
          Cancelar
        </button>
      </div>
    </form>
  );
};

export default EditProfileForm;