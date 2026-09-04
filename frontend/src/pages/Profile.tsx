import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

import type { Post, User } from '../types';

import {
  getMeRequest,
  getUserByIdRequest,
} from '../services/user.service';

import { getPostsByUserRequest } from '../services/post.service';

import { useAuth } from '../context/AuthContext';

import ProfileHeader from '../components/ProfileHeader';
import EditProfileForm from '../components/EditProfileForm';
import PostCard from '../components/PostCard';

const Profile = () => {
  const { id } = useParams();
  const { user: loggedUser } = useAuth();

  const [profile, setProfile] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);

  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);

  const isOwnProfile = !id;

  useEffect(() => {
    const loadProfile = async () => {
      setLoading(true);
      setError(null);

      try {
        const userResponse = isOwnProfile
          ? await getMeRequest()
          : await getUserByIdRequest(Number(id));

        const profileUser = userResponse.data;

        setProfile(profileUser);

        const postsResponse =
          await getPostsByUserRequest(profileUser.id);

        setPosts(postsResponse.data.posts);
      } catch (err) {
        if (
          axios.isAxiosError(err) &&
          err.response
        ) {
          setError(
            err.response.data.message ||
            'No se pudo cargar el perfil'
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

    loadProfile();
  }, [id, isOwnProfile]);

  const handleProfileUpdated = (
    updatedUser: User
  ) => {
    setProfile(updatedUser);
    setEditing(false);

    if (
      loggedUser &&
      updatedUser.id === loggedUser.id
    ) {
      // Actualizamos la información visual del perfil.
      // El AuthContext se mantiene intacto por ahora.
    }
  };

  if (loading) {
    return (
      <p className="loading-state">
        Cargando perfil...
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

  if (!profile) {
    return (
      <p className="empty-state">
        Usuario no encontrado.
      </p>
    );
  }

  return (
    <div className="profile-page">
      {editing && isOwnProfile ? (
        <EditProfileForm
          user={profile}
          onUpdated={handleProfileUpdated}
          onCancel={() => setEditing(false)}
        />
      ) : (
        <ProfileHeader
          user={profile}
          isOwnProfile={isOwnProfile}
          onEdit={() => setEditing(true)}
        />
      )}

      <section className="profile-posts">
        <h2>
          {isOwnProfile
            ? 'Mis publicaciones'
            : `Publicaciones de ${profile.name}`}
        </h2>

        {posts.length === 0 ? (
          <p className="empty-state">
            Este usuario todavía no tiene publicaciones.
          </p>
        ) : (
          posts.map((post) => (
            <PostCard
              key={post.id}
              post={post}
            />
          ))
        )}
      </section>
    </div>
  );
};

export default Profile;