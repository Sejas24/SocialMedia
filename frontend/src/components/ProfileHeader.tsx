import type { User } from '../types';

interface Props {
  user: User;
  isOwnProfile: boolean;
  onEdit?: () => void;
}

const ProfileHeader = ({
  user,
  isOwnProfile,
  onEdit,
}: Props) => {
  return (
    <section className="profile-header">
      <div className="profile-avatar avatar-ring">
        {user.avatar ? (
          <img
            src={user.avatar}
            alt={user.name}
          />
        ) : (
          <div className="profile-avatar-placeholder">
            👤
          </div>
        )}
      </div>

      <div className="profile-info">
        <h1>{user.name}</h1>

        <p className="profile-email">
          {user.email}
        </p>

        <p className="profile-bio">
          {user.bio || 'Este usuario todavía no tiene una biografía.'}
        </p>

        {isOwnProfile && onEdit && (
          <button
            type="button"
            className="btn btn-primary"
            onClick={onEdit}
          >
            Editar perfil
          </button>
        )}
      </div>
    </section>
  );
};

export default ProfileHeader;