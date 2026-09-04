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
    <section className="profile-card">

      <div className="profile-cover">
        <div className="profile-cover-shape profile-cover-shape-one" />
        <div className="profile-cover-shape profile-cover-shape-two" />
      </div>

      <div className="profile-card-content">

        <div className="profile-avatar-container">
          <div className="profile-avatar">
            <img
              src={user.avatar ?? '/default-avatar.png'}
              alt={user.name}
            />
          </div>

          {isOwnProfile && (
            <div className="profile-camera">
              📷
            </div>
          )}
        </div>

        <div className="profile-main-info">

          <div className="profile-title-row">
            <div>
              <h1>{user.name}</h1>

              <p className="profile-email">
                {user.email}
              </p>
            </div>

            {isOwnProfile && onEdit && (
              <button
                type="button"
                className="profile-edit-button"
                onClick={onEdit}
              >
                Editar perfil
              </button>
            )}
          </div>

          <p className="profile-bio">
            {user.bio ||
              'Este usuario todavía no tiene una biografía.'}
          </p>

          <div className="profile-social-info">
            <FollowStats userId={user.id} />

            {!isOwnProfile && (
              <FollowButton userId={user.id} />
            )}
          </div>

        </div>
      </div>
    </section>
  );
};

export default ProfileHeader;