import { Icon } from '../../shared/components/icons/icons';
import DiaryGallery from './DiaryGallery';
import ReviewStars from './ReviewStars';
import type { IDiaryEntry } from '../../domain/entities/social/TravelDiary';

interface DiaryEntryCardProps {
  entry: IDiaryEntry;
}

const formatDate = (iso?: string) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return iso;
  return new Intl.DateTimeFormat('es-ES', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
};

/** One "step" of the travel story: narrative + photos + review. */
export default function DiaryEntryCard({ entry }: DiaryEntryCardProps) {
  const date = formatDate(entry.date);

  return (
    <article className="diary-entry" id={entry.id}>
      <div className="diary-entry-rail" aria-hidden="true">
        <span className="diary-entry-node">
          <Icon icon="photo" />
        </span>
      </div>

      <div className="diary-entry-main">
        <div className="diary-entry-head">
          {date ? <span className="diary-entry-date">{date}</span> : null}
          {entry.mood ? <span className="diary-entry-mood">{entry.mood}</span> : null}
        </div>

        <h2 className="diary-entry-title">{entry.heading}</h2>
        <p className="diary-entry-body">{entry.body}</p>

        {entry.photos && entry.photos.length > 0 ? (
          <DiaryGallery photos={entry.photos} alt={entry.heading} />
        ) : null}

        {entry.rating || entry.review ? (
          <div className="diary-review">
            <div className="diary-review-head">
              {entry.rating ? <ReviewStars rating={entry.rating} /> : null}
              {entry.placeName ? (
                <span className="diary-review-place">
                  <Icon icon="pin" />
                  {entry.placeName}
                </span>
              ) : null}
            </div>
            {entry.review ? <p className="diary-review-text">{entry.review}</p> : null}
          </div>
        ) : null}

        <div className="diary-entry-actions">
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
    </article>
  );
}
