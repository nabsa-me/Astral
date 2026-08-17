import { Link } from 'react-router';
import { Icon } from '../../shared/components/icons/icons';
import { diaryPath } from '../../app/appRoutes';
import type { IVacation } from '../../domain/entities/Vacation';
import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { IUser } from '../../domain/entities/social/User';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';

interface TripSummaryProps {
  vacation: IVacation;
  sharedRoute?: ISharedRoute | null;
  owner?: IUser | null;
  diaries: ITravelDiary[];
  stopsTotal: number;
  stopsDone: number;
}

const initial = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '·');

export default function TripSummary({
  vacation,
  sharedRoute,
  owner,
  diaries,
  stopsTotal,
  stopsDone,
}: TripSummaryProps) {
  const place = sharedRoute?.cityName ?? vacation.subtitle;
  const tags = sharedRoute?.tags ?? [];
  const progress = stopsTotal > 0 ? Math.round((stopsDone / stopsTotal) * 100) : 0;

  return (
    <section className="trip-summary">
      <span className="trip-summary-kind">
        <Icon icon="route" />
        Plan de ruta
      </span>

      <div className="trip-summary-owner">
        <span className="trip-summary-avatar">{initial(owner?.displayName)}</span>
        <span className="trip-summary-owner-name">
          {owner?.displayName ?? 'Viajero'}
          {owner?.handle ? (
            <span className="trip-summary-owner-handle"> · @{owner.handle}</span>
          ) : null}
        </span>
      </div>

      <h1 className="trip-summary-title">{vacation.title}</h1>

      <div className="trip-summary-meta">
        {place ? (
          <span className="trip-summary-meta-item">
            <Icon icon="map" />
            {place}
          </span>
        ) : null}
        <span className="trip-summary-meta-item">
          <Icon icon="schedule" />
          {vacation.days.length} días
        </span>
        {stopsTotal > 0 ? (
          <span className="trip-summary-meta-item">
            <Icon icon="pin" />
            {stopsDone}/{stopsTotal} paradas · {progress}%
          </span>
        ) : null}
      </div>

      {stopsTotal > 0 ? (
        <div
          className="trip-summary-progress"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso del plan"
        >
          <span className="trip-summary-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      ) : null}

      {tags.length > 0 ? (
        <div className="trip-summary-tags">
          {tags.map((tag) => (
            <span key={tag} className="trip-summary-chip">
              {tag}
            </span>
          ))}
        </div>
      ) : null}

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
      </div>
    </section>
  );
}
