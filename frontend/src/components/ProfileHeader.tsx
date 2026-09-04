import type { User } from '../types';
import FollowButton from './FollowButton';
import FollowStats from './FollowStats';

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
            src={user.avatar ?? '/default-avatar.png'}
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

     {/* //agregar el boton de seguir y los stats de seguidores y seguidos -- falta verificar  */}
     {/* follow stats and follow button */}

      <FollowStats userId={user.id} />
      {!isOwnProfile && (
        <FollowButton userId={user.id} />
      )}
    </section>
  );
};

export default ProfileHeader;