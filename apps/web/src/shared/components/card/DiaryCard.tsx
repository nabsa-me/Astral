import { Icon } from '../icons/icons';
import type { ITravelDiary } from '../../../domain/entities/social/TravelDiary';

interface DiaryCardProps {
  diary: ITravelDiary;
  routeTitle?: string;
  onOpen?: () => void;
}

const coverOf = (diary: ITravelDiary) =>
  diary.coverImageUrl ?? diary.entries.find((e) => e.photos?.length)?.photos?.[0];

const photoCountOf = (diary: ITravelDiary) =>
  diary.entries.reduce((sum, e) => sum + (e.photos?.length ?? 0), 0);

export const DiaryCard = ({ diary, routeTitle, onOpen }: DiaryCardProps) => {
  const cover = coverOf(diary);
  const photoCount = photoCountOf(diary);

  return (
    <article
      className={`diary-card${onOpen ? ' is-clickable' : ''}`}
      role={onOpen ? 'button' : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onClick={onOpen}
      onKeyDown={
        onOpen
          ? (event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen();
              }
            }
          : undefined
      }
    >
      <div
        className="diary-card-cover"
        style={cover ? { backgroundImage: `url(${cover})` } : undefined}
      >
        {!cover ? <Icon icon="menu_book" /> : null}
      </div>
      <div className="diary-card-body">
        <h3 className="diary-card-title">{diary.title}</h3>
        {diary.summary ? <p className="diary-card-summary">{diary.summary}</p> : null}
        {routeTitle ? (
          <span className="diary-card-route">
            <Icon icon="route" />
            Basado en {routeTitle}
          </span>
        ) : null}
        <div className="diary-card-footer">
          <span className="diary-card-meta">
            {diary.entries.length} {diary.entries.length === 1 ? 'entrada' : 'entradas'}
            {photoCount > 0 ? ` · ${photoCount} fotos` : ''}
          </span>
          {diary.stats ? (
            <div className="card-stats">
              <span className="card-stat" title="Reacciones (próximamente)">
                <Icon icon="favorite" />
                {diary.stats.likes}
              </span>
              <span className="card-stat" title="Comentarios (próximamente)">
                <Icon icon="chat_bubble" />
                {diary.stats.comments}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </article>
  );
};
