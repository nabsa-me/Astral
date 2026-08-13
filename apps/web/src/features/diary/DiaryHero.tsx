import { Link } from 'react-router';
import { Icon } from '../../shared/components/icons/icons';
import { tripPath } from '../../app/appRoutes';
import type { ITravelDiary } from '../../domain/entities/social/TravelDiary';
import type { ISharedRoute } from '../../domain/entities/social/SharedRoute';
import type { IUser } from '../../domain/entities/social/User';

interface DiaryHeroProps {
  diary: ITravelDiary;
  owner?: IUser | null;
  route?: ISharedRoute | null;
}

const initial = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '·');

const formatShort = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'short' }).format(date);
};

export default function DiaryHero({ diary, owner, route }: DiaryHeroProps) {
  const photoCount = diary.entries.reduce((sum, e) => sum + (e.photos?.length ?? 0), 0);
  const dates = diary.entries
    .map((e) => e.date)
    .filter((d): d is string => Boolean(d))
    .sort();
  const range =
    dates.length > 0
      ? dates.length > 1 && dates[0] !== dates[dates.length - 1]
        ? `${formatShort(dates[0])} – ${formatShort(dates[dates.length - 1])}`
        : formatShort(dates[0])
      : null;
  const cover = diary.coverImageUrl ?? diary.entries.find((e) => e.photos?.length)?.photos?.[0];

  return (
    <header
      className="diary-hero"
      style={cover ? { backgroundImage: `url(${cover})` } : undefined}
    >
      <div className="diary-hero-scrim" />
      <div className="diary-hero-inner">
        <span className="diary-hero-kind">
          <Icon icon="menu_book" />
          Diario de viaje
        </span>

        <div className="diary-hero-owner">
          <span className="diary-hero-avatar">{initial(owner?.displayName)}</span>
          <span className="diary-hero-owner-name">
            {owner?.displayName ?? 'Viajero'}
            {owner?.handle ? (
              <span className="diary-hero-owner-handle"> · @{owner.handle}</span>
            ) : null}
          </span>
        </div>

        <h1 className="diary-hero-title">{diary.title}</h1>
        {diary.summary ? <p className="diary-hero-summary">{diary.summary}</p> : null}

        <div className="diary-hero-meta">
          {route?.cityName ? (
            <span className="diary-hero-meta-item">
              <Icon icon="map" />
              {route.cityName}
            </span>
          ) : null}
          {range ? (
            <span className="diary-hero-meta-item">
              <Icon icon="schedule" />
              {range}
            </span>
          ) : null}
          <span className="diary-hero-meta-item">
            <Icon icon="menu_book" />
            {diary.entries.length} entradas
          </span>
          {photoCount > 0 ? (
            <span className="diary-hero-meta-item">
              <Icon icon="photo" />
              {photoCount} fotos
            </span>
          ) : null}
        </div>

        {route ? (
          <Link className="diary-hero-route" to={tripPath(route.vacationId ?? route.id)}>
            <Icon icon="route" />
            Basado en la ruta: {route.title}
            <Icon icon="chevron_right" type="bold" />
          </Link>
        ) : null}

        <div className="diary-hero-actions">
          <button type="button" disabled title="Próximamente">
            <Icon icon="person" />
            Seguir
          </button>
          <button type="button" disabled title="Reacciones (próximamente)">
            <Icon icon="favorite" />
            Me gusta
          </button>
          <button type="button" disabled title="Comentarios (próximamente)">
            <Icon icon="chat_bubble" />
            Comentar
          </button>
        </div>
      </div>
    </header>
  );
}
