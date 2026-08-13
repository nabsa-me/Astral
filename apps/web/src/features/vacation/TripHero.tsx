import { Link } from 'react-router';
import { Icon } from '../../shared/components/icons/icons';
import { diaryPath } from '../../app/appRoutes';
import type { IVacation } from '../../domain/entities/Vacation';
import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { IUser } from '../../domain/entities/social/User';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';

interface TripHeroProps {
  vacation: IVacation;
  sharedRoute?: ISharedRoute | null;
  owner?: IUser | null;
  stopsTotal: number;
  stopsDone: number;
  diaries: ITravelDiary[];
}

const initial = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '·');

export default function TripHero({
  vacation,
  sharedRoute,
  owner,
  stopsTotal,
  stopsDone,
  diaries,
}: TripHeroProps) {
  const place = sharedRoute?.cityName ?? vacation.subtitle;
  const tags = sharedRoute?.tags ?? [];
  const progress = stopsTotal > 0 ? Math.round((stopsDone / stopsTotal) * 100) : 0;

  return (
    <header className="trip-hero">
      <div className="trip-hero-inner">
        <span className="trip-hero-kind">
          <Icon icon="route" />
          Plan de ruta
        </span>

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
            <Icon icon="schedule" />
            {vacation.days.length} días
          </span>
          {stopsTotal > 0 ? (
            <span className="trip-hero-meta-item">
              <Icon icon="pin" />
              {stopsDone}/{stopsTotal} paradas listas
            </span>
          ) : null}
        </div>

        {stopsTotal > 0 ? (
          <div
            className="trip-progress"
            role="progressbar"
            aria-valuenow={progress}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label="Progreso del plan"
          >
            <span className="trip-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        ) : null}

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
          <button className="trip-hero-action" type="button" disabled title="Próximamente">
            <Icon icon="edit" />
            Editar plan
          </button>
          <button className="trip-hero-action" type="button" disabled title="Próximamente">
            <Icon icon="add" />
            Duplicar ruta
          </button>
          <button className="trip-hero-action" type="button" disabled title="Guardar (próximamente)">
            Guardar
          </button>
        </div>

        <div className="trip-diaries">
          <span className="trip-diaries-label">
            <Icon icon="menu_book" />
            Diarios de esta ruta
          </span>
          {diaries.length > 0 ? (
            <div className="trip-diaries-list">
              {diaries.map((diary) => (
                <Link key={diary.id} to={diaryPath(diary.id)} className="trip-diaries-link">
                  {diary.title}
                  <Icon icon="chevron_right" type="bold" />
                </Link>
              ))}
            </div>
          ) : (
            <p className="trip-diaries-empty">Aún no hay diarios basados en esta ruta.</p>
          )}
          <button
            className="trip-diaries-cta"
            type="button"
            disabled
            title="Próximamente"
          >
            <Icon icon="add" />
            Empezar diario desde esta ruta
          </button>
        </div>
      </div>
    </header>
  );
}
