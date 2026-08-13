import { Icon } from '../icons/icons';
import type { ISharedRoute } from '../../../domain/entities/social/SharedRoute';
import type { IUser } from '../../../domain/entities/social/User';

interface RouteCardProps {
  route: ISharedRoute;
  owner?: IUser | null;
  onOpen?: () => void;
}

const initial = (name?: string) => (name ? name.trim().charAt(0).toUpperCase() : '·');

export const RouteCard = ({ route, owner, onOpen }: RouteCardProps) => (
  <article
    className="route-card"
    role="button"
    tabIndex={0}
    onClick={onOpen}
    onKeyDown={(event) => {
      if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        onOpen?.();
      }
    }}
  >
    <div className="route-card-cover" aria-hidden="true">
      <span className="route-card-kind">
        <Icon icon="route" />
        Plan{route.durationDays ? ` · ${route.durationDays} días` : ''}
      </span>
      <span className="route-card-cover-city">{route.cityName ?? route.cityId}</span>
    </div>
    <div className="route-card-body">
      <div className="route-card-owner">
        <span className="route-card-avatar">{initial(owner?.displayName)}</span>
        <span className="route-card-owner-name">
          {owner?.displayName ?? 'Viajero'}
          {owner?.handle ? (
            <span className="route-card-owner-handle"> · @{owner.handle}</span>
          ) : null}
        </span>
      </div>
      <h3 className="route-card-title">{route.title}</h3>
      {route.summary ? <p className="route-card-summary">{route.summary}</p> : null}
      {route.tags && route.tags.length > 0 ? (
        <div className="route-card-tags">
          {route.tags.map((tag) => (
            <span key={tag} className="chip">
              {tag}
            </span>
          ))}
        </div>
      ) : null}
      <div className="route-card-footer">
        <span className="route-card-meta">
          {route.durationDays ? `${route.durationDays} días` : 'Ruta'}
          {route.cityName ? ` · ${route.cityName}` : ''}
        </span>
        <div className="card-stats">
          <span className="card-stat" title="Reacciones (próximamente)">
            <Icon icon="favorite" />
            {route.stats.likes}
          </span>
          <span className="card-stat" title="Comentarios (próximamente)">
            <Icon icon="chat_bubble" />
            {route.stats.comments}
          </span>
        </div>
      </div>
    </div>
  </article>
);
