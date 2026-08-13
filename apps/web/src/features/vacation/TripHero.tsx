import { Icon } from '../../shared/components/icons/icons';
import type { IVacation } from '../../domain/entities/Vacation';
import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { IUser } from '../../domain/entities/social/User';

interface TripHeroProps {
  vacation: IVacation;
  sharedRoute?: ISharedRoute | null;
  owner?: IUser | null;
}

const initial = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '·');

export default function TripHero({ vacation, sharedRoute, owner }: TripHeroProps) {
  const place = sharedRoute?.cityName ?? vacation.subtitle;
  const tags = sharedRoute?.tags ?? [];
  const stats = sharedRoute?.stats;

  return (
    <header className="trip-hero">
      <div className="trip-hero-inner">
        <div className="trip-hero-owner">
          <span className="trip-hero-avatar">{initial(owner?.displayName)}</span>
          <span className="trip-hero-owner-name">
            {owner?.displayName ?? 'Viajero'}
            {owner?.handle ? (
              <span className="trip-hero-owner-handle"> · @{owner.handle}</span>
            ) : null}
          </span>
        </div>

        <h1 className="trip-hero-title">{vacation.title}</h1>

        <div className="trip-hero-meta">
          {place ? (
            <span className="trip-hero-meta-item">
              <Icon icon="map" />
              {place}
            </span>
          ) : null}
          <span className="trip-hero-meta-item">
            <Icon icon="route" />
            {vacation.days.length} días
          </span>
        </div>

        {tags.length > 0 ? (
          <div className="trip-hero-tags">
            {tags.map((tag) => (
              <span key={tag} className="trip-hero-chip">
                {tag}
              </span>
            ))}
          </div>
        ) : null}

        <div className="trip-hero-actions">
          <button className="trip-hero-action" type="button" disabled title="Reacciones (próximamente)">
            <Icon icon="favorite" />
            {stats?.likes ?? 0}
          </button>
          <button className="trip-hero-action" type="button" disabled title="Comentarios (próximamente)">
            <Icon icon="chat_bubble" />
            {stats?.comments ?? 0}
          </button>
          <button className="trip-hero-action" type="button" disabled title="Guardar (próximamente)">
            Guardar
          </button>
        </div>
      </div>
    </header>
  );
}
