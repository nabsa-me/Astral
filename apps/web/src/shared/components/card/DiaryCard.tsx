import { Icon } from '../icons/icons';
import type { ITravelDiary } from '../../../domain/entities/social/TravelDiary';

interface DiaryCardProps {
  diary: ITravelDiary;
  onOpen?: () => void;
}

export const DiaryCard = ({ diary, onOpen }: DiaryCardProps) => (
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
    <span className="diary-card-icon">
      <Icon icon="menu_book" />
    </span>
    <div className="diary-card-body">
      <h3 className="diary-card-title">{diary.title}</h3>
      {diary.summary ? <p className="diary-card-summary">{diary.summary}</p> : null}
      <div className="diary-card-footer">
        <span className="diary-card-meta">
          {diary.entries.length} {diary.entries.length === 1 ? 'entrada' : 'entradas'}
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
